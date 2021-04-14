function handleAction(event) {
    function createJournalPostDraftInstance() {
        function retrieveDraftFromCacheIfSet() {
            var cachedDraft = CacheService.getUserCache().get(journalPostDraftCacheKey);
            if (cachedDraft) {
                journalPostDraft._setInternalDataObject(JSON.parse(cachedDraft));
            }
        }

        var journalPostDraft = JournalPostDraft();
        retrieveDraftFromCacheIfSet();
        return journalPostDraft;
    }

    function storeDraftInCache() {
        CacheService.getUserCache().put(journalPostDraftCacheKey, JSON.stringify(journalPostDraft._getInternalDataObject()), 3600);
    }

    function throwExceptionIfHandlerIsInvalid() {
        if (!handler) {
            throw new Error(Strings.ActionHandler.Invalid + action);
        }
    }

    function throwExceptionIfActionIsInvalid() {
        if (!action) {
            throw new Error(Strings.ActionHandler.NotSet);
        }
    }

    function logTechnicalErrorAndReturnErrorUuid(err) {
        var errorUuid = Utilities.getUuid();
        console.log("ActionHandler fatal error (" + errorUuid + "):\n\tError message: " + err + "\n\tEvent object: " + JSON.stringify(event) + "\n\tJournalPostDraft object: " + JSON.stringify(journalPostDraft._getInternalDataObject()) + "\n\tStacktrace:\n" + err.stack);
        return errorUuid;
    }

    function createInternalErrorCard(errorUuid) {
        var errorCard = ErrorMessageCard(Strings.ActionHandler.ErrorCardTitle + Strings.Common.ErrorCardTitlePostfix, Strings.ActionHandler.ErrorCardHeaderTitle, Strings.ActionHandler.GenericError + errorUuid);
        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(errorCard)).build();
    }

    var action = event.parameters.action;
    var handler = ActionHandlers[action];
    var messageId = event.messageMetadata.messageId;
    var journalPostDraftCacheKey = messageId + "_JournalPostDraft";
    var journalPostDraft = createJournalPostDraftInstance();
    var authorizedUrlFetch = AuthorizedUrlFetch();
    var addressInfoCodeService = AddressInfoCodeService(authorizedUrlFetch);
    var services = {
        ArchiveId: ArchiveIdService(authorizedUrlFetch),
        AddressInfoCode: addressInfoCodeService,
        AddressInfoPrefill: AddressInfoPrefillService(addressInfoCodeService, journalPostDraft, event.messageMetadata.messageId),
        MailAttachments: MailAttachmentsService(authorizedUrlFetch, messageId),
        Import: ImportService(authorizedUrlFetch, messageId),
        ChooseHandlerCode: ChooseHandlerCodeService(authorizedUrlFetch),
        WebsakCheck: WebsakCheckService(authorizedUrlFetch),
        ImportLog: ImportLogService(authorizedUrlFetch, messageId),
        LastUsedArchiveId: LastUsedArchiveIdService(authorizedUrlFetch),
        MailMetadata: MailMetadataService(authorizedUrlFetch, messageId),
    }

    throwExceptionIfActionIsInvalid();
    throwExceptionIfHandlerIsInvalid();

    var handlerResult;

    try {
        handlerResult = handler(event, journalPostDraft, services);
    } catch(err) {
        errorUuid = logTechnicalErrorAndReturnErrorUuid(err);
        handlerResult = createInternalErrorCard(errorUuid);        
    }
    
    storeDraftInCache();
    return handlerResult;
}

var ActionHandlers = {
    "a_buildaddon_buildaddon": function(eventData, journalPostDraft, services) {
        function isUserSetupCorrectlyInWebsak() { return services.WebsakCheck.getUserStatus().valid; }

        var card;
        if (isUserSetupCorrectlyInWebsak()) {
            card = ArchiveCard(services.LastUsedArchiveId.getArchiveId(), services.ImportLog.getLastId())
        } else {
            card = UserCheckErrorCard();
        }

        return [card];
    },
    "a_usercheckerror_retry": function(eventData, journalPostDraft, services) {
        var card = ActionHandlers[Actions.BuildAddon.BuildAddon](eventData, journalPostDraft, services)[0];
        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(card)).build();
    },
    "a_archiveid_setid": function(eventData, journalPostDraft, services) {
        function logTechnicalErrorAndReturnUserFriendlyMessage(result, searchResult) {
            var errorUuid = Utilities.getUuid();
            console.log("ArchiveID handler search result (" + errorUuid + "): " + result);
            searchResult = { searchError: Strings.ArchiveId.InvalidServerMessage + errorUuid };
            return searchResult;
        }

        function archiveIdFieldIsEmpty() { return givenArchiveId === undefined; }
        function validArchiveWasFound() { return searchResult.archiveid; }
        function userCanSetHandler() { return services.WebsakCheck.getUserStatus().chooseHandler; }

        var card, searchResult;
        var givenArchiveId = eventData.formInput.f_archiveid_id;

        try {
            if (archiveIdFieldIsEmpty()) {
                searchResult = { "searchError": Strings.ArchiveId.MissingArchiveId };
            } else {
                var result = services.ArchiveId.get(givenArchiveId);
                searchResult = JSON.parse(result);
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                searchResult = logTechnicalErrorAndReturnUserFriendlyMessage(result, searchResult);
            } else {
                throw e;
            }
        }

        if (validArchiveWasFound()) {
            journalPostDraft.setArchiveId(searchResult);
            if (userCanSetHandler()) {
                card = ChooseHandlerCard();
            } else {
                card = TitleCard(eventData.messageMetadata.messageId);
            }
        } else {
            card = ErrorMessageCard(Strings.ArchiveId.CardTitle + Strings.Common.ErrorCardTitlePostfix, Strings.ArchiveId.CardHeaderTitle, searchResult.searchError);
        }

        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(card)).build();
    },
    "a_choosehandler_sethandlercode": function(eventData, journalPostDraft, services) {
        function isHandlerCodeNonEmpty() { return givenUserCode && givenUserCode.replace(/\s+/g, '').length > 0; }
        function getValidHandlerCode() {
            var extractedUserName = givenUserCode.match('^[^:]*')[0];
            var suggestions = services.ChooseHandlerCode.getSuggestions();

            for (var i = 0; i < suggestions.length; i++) {
                if (suggestions[i].toLowerCase().indexOf(extractedUserName.toLowerCase() + ":") === 0) {
                    return suggestions[i];
                }
            }
            return undefined;
        }

        var givenUserCode = eventData.formInput.f_choosehandler_handlercode_id, card;
        var handlerCode = isHandlerCodeNonEmpty() ? getValidHandlerCode() : undefined;

        if (handlerCode) {
            journalPostDraft.setHandler(handlerCode);
            card = TitleCard(eventData.messageMetadata.messageId);
        } else {
            var errorMessage;
            if (isHandlerCodeNonEmpty()) {
                errorMessage = Strings.ChooseHandler.InvalidHandlerCode;
            } else {
                errorMessage = Strings.ChooseHandler.MissingHandlerCode;
            }
            card = ErrorMessageCard(Strings.ChooseHandler.CardTitle + Strings.Common.ErrorCardTitlePostfix, Strings.ChooseHandler.CardHeaderTitle, errorMessage);
        }

        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(card)).build();
    },
    "a_journalposttitle_settitle": function(eventData, journalPostDraft, services) {
        function titleIsNonEmpty() { return givenTitle && givenTitle.replace(/\s+/g, '').length > 0; }

        var givenTitle = eventData.formInput.f_journalposttitle_title, card;

        if (titleIsNonEmpty()) {
            journalPostDraft.setJournalPostTitle(givenTitle);
            card = DocumentTypeCard(services.MailMetadata.isActiveUserSender());
        } else {
            card = ErrorMessageCard(Strings.JournalPostTitle.CardTitle + Strings.Common.ErrorCardTitlePostfix, Strings.JournalPostTitle.CardHeaderTitle, Strings.JournalPostTitle.MissingJournalPostTitle);
        }

        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(card)).build();
    },
    "a_documenttype_setdocumenttype": function(eventData, journalPostDraft, services) {
        function chooseNextCardBasedOnDocumentType() {
            return journalPostDraft.getDocumentType() == Strings.DocumentType.DocumentTypeListXnotatId ? AttachmentCard(services.MailAttachments.getAttachments()) : AddressInfoCard(eventData.messageMetadata.messageId, journalPostDraft, services.AddressInfoPrefill);
        }
        
        journalPostDraft.setDocumentType(eventData.formInput.f_documenttype_id);

        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(chooseNextCardBasedOnDocumentType())).build();
    },
    "a_addressinfo_setaddressinfo": function(eventData, journalPostDraft, services) {
        function isNameNonEmpty() { return fullname && fullname.replace(/\s+/g, '').length > 0; }
        var card, fullname = eventData.formInput.f_addressinfo_fullname_id;

        if (isNameNonEmpty()) {
            journalPostDraft.setAddressInfo({
                Name: eventData.formInput.f_addressinfo_fullname_id,
                Address: eventData.formInput.f_addressinfo_address_id,
                Mail: eventData.formInput.f_addressinfo_mail_id,
                ZipCode: eventData.formInput.f_addressinfo_zipcode_id,
                City: eventData.formInput.f_addressinfo_city_id,
            });
            card = AttachmentCard(services.MailAttachments.getAttachments());
        } else {
            card = ErrorMessageCard((journalPostDraft.getDocumentType() == Strings.DocumentType.DocumentTypeListIngaendeId ? Strings.AddressInfo.CardTitleReceiver : Strings.AddressInfo.CardTitleSender) + Strings.Common.ErrorCardTitlePostfix, Strings.AddressInfo.CardHeaderTitleAddress, Strings.AddressInfo.MissingFullname);
        }

        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(card)).build();
    },
    "a_addressinfo_setusercode": function(eventData, journalPostDraft, services) {
        function isUserCodeNonEmpty() { return givenUserCode && givenUserCode.replace(/\s+/g, '').length > 0; }
        function getValidUserCode() {
            var extractedUserName = givenUserCode.match('^[^:]*')[0];
            var suggestions = services.AddressInfoCode.getSuggestions(extractedUserName);

            for (var i = 0; i < suggestions.length; i++) {
                if (suggestions[i].toLowerCase().indexOf(extractedUserName.toLowerCase() + ":") === 0) {
                    return suggestions[i];
                }
            }
            return undefined;
        }

        var card, givenUserCode = eventData.formInput.f_addressinfo_usercode_id;

        if (isUserCodeNonEmpty() && getValidUserCode()) {
            var fullSuggestion = services.AddressInfoCode.getFullSuggestion(getValidUserCode());
            var addressInfo = { UserCode: fullSuggestion.code, Name: fullSuggestion.name, Address: fullSuggestion.address1, Mail: fullSuggestion.mail, ZipCode: fullSuggestion.zipcode, City: fullSuggestion.city };

            if (fullSuggestion.duplicate) {
                delete addressInfo.UserCode;
            }

            journalPostDraft.setAddressInfo(addressInfo);
            card = AttachmentCard(services.MailAttachments.getAttachments());
        } else {
            var errorMessage;
            if (isUserCodeNonEmpty()) {
                errorMessage = Strings.AddressInfo.InvalidUserCode;
            } else {
                errorMessage = Strings.AddressInfo.MissingUserCode;
            }
            card = ErrorMessageCard((journalPostDraft.getDocumentType() == Strings.DocumentType.DocumentTypeListIngaendeId ? Strings.AddressInfo.CardTitleReceiver : Strings.AddressInfo.CardTitleSender) + Strings.Common.ErrorCardTitlePostfix, Strings.AddressInfo.CardHeaderTitleUserCode, errorMessage);
        }

        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(card)).build();
    },
    "a_attachment_setattachments": function(eventData, journalPostDraft, services) {
        function createJournalAttachment() {
            var attachment = { id: fullAttachmentList[i].id, text: fullAttachmentList[i].text, main: fullAttachmentList[i].id == selectedMainDocumentId };

            return attachment;
        }

        var selectedAttachmentIds = eventData.formInputs.f_attachment_attachments_id;
        var selectedMainDocumentId = eventData.formInput.f_attachment_maindocument_id;
        var fullAttachmentList = services.MailAttachments.getAttachments();
        var attachmentImportList = [];

        for (var i = 0; i < fullAttachmentList.length; ++i) {
            if (fullAttachmentList[i].id == selectedMainDocumentId) {
                attachmentImportList.push(createJournalAttachment());
            } else {
                for (var j = 0; selectedAttachmentIds && j < selectedAttachmentIds.length; ++j) {
                    if (fullAttachmentList[i].id == selectedAttachmentIds[j]) {
                        attachmentImportList.push(createJournalAttachment());
                    }
                }
            }
        }

        journalPostDraft.setAttachment(attachmentImportList);

        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(SummaryCard(journalPostDraft))).build();
    },
    "a_summary_startimport": function(eventData, journalPostDraft, services) {
        var result = services.Import.import(journalPostDraft), card;

        if (result.status == 'jp.id') {
            card = ImportDoneCard(result.message);
        } else {
            card = ErrorMessageCard(Strings.Import.CardTitle + Strings.Common.ErrorCardTitlePostfix, Strings.Import.CardHeaderTitle, result.message);
        }

        return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().pushCard(card)).build();
    }
};
