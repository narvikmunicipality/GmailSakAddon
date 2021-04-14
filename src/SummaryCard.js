var SummaryCard = function(journalPostDraft) {
    function createArchiveIdKeyValue() {
        var archiveId = journalPostDraft.getArchiveId();
        var archiveIdText = archiveId.archiveid + " - " + archiveId.archivetitle;
        return CardService.newKeyValue().setTopLabel(Strings.Summary.ArchiveIdLabel).setContent(archiveIdText).setIconUrl(GmailsakIcon.ArchiveId);
    }

    function createChooseHandlerKeyValue() {
        return CardService.newKeyValue().setTopLabel(Strings.Summary.ChooseHandlerLabel).setContent(journalPostDraft.getHandler()).setIconUrl(GmailsakIcon.ChooseHandler);
    }

    function createJournalPostTitleKeyValue() {
        return CardService.newKeyValue().setTopLabel(Strings.Summary.JournalPostTitleLabel).setContent(journalPostDraft.getJournalPostTitle()).setIconUrl(GmailsakIcon.JournalPostTitle);
    }

    function createDocumentTypeKeyValue() {
        var documentTypeTitle = { I: Strings.DocumentType.DocumentTypeListIngaendeText, U: Strings.DocumentType.DocumentTypeListUtgaendeText, X: Strings.DocumentType.DocumentTypeListXnotatText };
        return CardService.newKeyValue().setTopLabel(Strings.Summary.DocumentTypeLabel).setContent(documentTypeTitle[journalPostDraft.getDocumentType()]).setIconUrl(GmailsakIcon.DocumentType);
    }

    function createAddressInfoKeyValue() {
        function formattedSender() {
            function addressZipSeparator() {
                return address.length > 0 && locationField().length > 0 ? " - " : "";
            }

            function zipCitySeparator() {
                return zipCode.length > 0 && city.length > 0 ? " " : "";
            }

            function locationField() {
                return zipCode + zipCitySeparator() + city;
            }

            function combinedAddressAndLocation() {
                return address + addressZipSeparator() + locationField();
            }

            function addressLocationField() {
                return combinedAddressAndLocation().length > 0 ? " (" + combinedAddressAndLocation() + ")" : "";
            }

            function mailField() {
                return mail.length > 0 ? ' <' + mail + '>' : '';
            }

            function definedOrEmpty(field) {
                return field !== undefined && field != null && field.length > 0 ? field : "";
            }

            var addressInfo = journalPostDraft.getAddressInfo();

            if (addressInfo !== undefined) {
                var address = definedOrEmpty(addressInfo.Address);
                var mail = definedOrEmpty(addressInfo.Mail);
                var zipCode = definedOrEmpty(addressInfo.ZipCode);
                var city = definedOrEmpty(addressInfo.City);

                return (!!addressInfo.UserCode && !addressInfo.Duplicate ? addressInfo.UserCode.toUpperCase() + (addressInfo.Name ? " - " : '') : '') + definedOrEmpty(addressInfo.Name) + mailField() + addressLocationField();
            } else {
                return '';
            }
        }

        var addressInfoCardTitle = { I: Strings.Summary.AddressInfoReceiverLabel, U: Strings.Summary.AddressInfoSenderLabel, X: Strings.Summary.AddressInfoUserCodeLabel };
        return CardService.newKeyValue().setTopLabel(addressInfoCardTitle[journalPostDraft.getDocumentType()]).setContent(formattedSender()).setMultiline(true).setIconUrl(GmailsakIcon.AddressInfo);
    }

    function createAttachmentKeyValue() {
        function italicTag(text) {
            return "<i>" + text + "</i>";
        }

        function attachmentsAsFormattedString(attachments) {
            var formattedString = "";
            for (var i = 0; i < attachments.length; ++i) {
                if (formattedString.length != 0) {
                    formattedString += '<br>';
                }
                formattedString += attachments[i].main ? italicTag(attachments[i].text) : attachments[i].text;
            }
            return formattedString;
        }

        var attachmentsAsText = attachmentsAsFormattedString(journalPostDraft.getAttachment());

        return CardService.newKeyValue().setTopLabel(Strings.Summary.AttachmentLabel).setContent(attachmentsAsText).setIconUrl(GmailsakIcon.Attachments);
    }

    var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle(Strings.Summary.CardTitle).setImageUrl(GmailsakIcon.Import));
    var section = CardService.newCardSection().setHeader(Strings.Summary.CardHeaderTitle);
    section.addWidget(createArchiveIdKeyValue());

    if (journalPostDraft.getHandler()) {
        section.addWidget(createChooseHandlerKeyValue());
    }

    section.addWidget(createJournalPostTitleKeyValue());
    section.addWidget(createDocumentTypeKeyValue());

    if (journalPostDraft.getDocumentType() != Strings.DocumentType.DocumentTypeListXnotatId) {
        section.addWidget(createAddressInfoKeyValue());
    }

    section.addWidget(createAttachmentKeyValue());
    section.addWidget(CardService.newTextButton().setText(Strings.Summary.StartImportButtonText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.Summary.StartImport })));
    card.addSection(section);


    return card.build();
};
