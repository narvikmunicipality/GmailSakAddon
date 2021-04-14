describe('ActionHandlerSetAddressInfoCode', function() {
    function formInput(parameters) {
        return { formInput: parameters };
    };

    var handler = ActionHandlers[Actions.AddressInfo.SetUserCode], parameters, original_attachmentCard, draftMock, services, addressInfoCodeServiceMock, original_errorMesssageCard, mailAttachmentsServiceMock;
    var TEST_CODE = "TEST_CODE", TEST_ATTACHMENT_CARD = "builtAttachmentCard", TEST_ERRORMESSAGE_CARD = "builtErrorMessageCard", ExpectedFullAddressInfo, TEST_ATTACHMENT_CARD_ATTACHMENTS = 'TestAttachments';
    
    beforeEach(function() {
        ExpectedFullAddressInfo = { "id": "1337", "code": "USER1", "name": "Lastname, Firstname", "address1": "Testveien 1", "zipcode": "8515", "city": "NARVIK", "mail": "firstname.lastname@example.com", "duplicate": false };
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['setAddressInfo', 'getDocumentType'])
        draftMock.getDocumentType.and.returnValue("I");
        original_attachmentCard = AttachmentCard;
        original_errorMesssageCard = ErrorMessageCard;
        ErrorMessageCard = jasmine.createSpy('ErrorMessageCard');
        ErrorMessageCard.and.returnValue(TEST_ERRORMESSAGE_CARD);
        AttachmentCard = jasmine.createSpy('AttachmentCard');
        AttachmentCard.and.returnValue(TEST_ATTACHMENT_CARD);
        addressInfoCodeServiceMock = jasmine.createSpyObj('AddressInfoCodeService', ['getSuggestions', 'getFullSuggestion']);
        addressInfoCodeServiceMock.getSuggestions.and.returnValue(['TEST_CODE: Test, User', 'ANOTHER1: Another, Decoy', 'ANOTHER: Another, Test', 'DUPE#1: Dupe, User', 'DUPE#2: Dupe, User']);
        addressInfoCodeServiceMock.getFullSuggestion.and.returnValue(ExpectedFullAddressInfo);
        mailAttachmentsServiceMock = jasmine.createSpyObj('MailAttachmentsService', ['getAttachments']);
        mailAttachmentsServiceMock.getAttachments.and.returnValue(TEST_ATTACHMENT_CARD_ATTACHMENTS);

        parameters = {};
        parameters[Fields.AddressInfo.UserCodeId] = TEST_CODE;

        services = { AddressInfoCode: addressInfoCodeServiceMock, MailAttachments: mailAttachmentsServiceMock };

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        AttachmentCard = original_attachmentCard;
        ErrorMessageCard = original_errorMesssageCard;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.AddressInfo.SetUserCode]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.AddressInfo.SetUserCode])).toBe("function");
    });

    it('sets user code in JournalPostDraft to matching value from address info code service', function() {
        handler(formInput(parameters), draftMock, services);

        expect(draftMock.setAddressInfo).toHaveBeenCalledWith({ UserCode: 'USER1', Name: 'Lastname, Firstname', Address: 'Testveien 1', Mail: 'firstname.lastname@example.com', ZipCode: '8515', City: 'NARVIK' });
    });

    it('removes usercode when suggestion is duplicate', function() {
        ExpectedFullAddressInfo.duplicate = true;

        handler(formInput(parameters), draftMock, services);

        expect(draftMock.setAddressInfo).toHaveBeenCalledWith({ Name: 'Lastname, Firstname', Address: 'Testveien 1', Mail: 'firstname.lastname@example.com', ZipCode: '8515', City: 'NARVIK' });
    });

    it('suggestion lookup uses username as filter to speed up search', function() {
        handler(formInput(parameters), draftMock, services);

        expect(addressInfoCodeServiceMock.getSuggestions).toHaveBeenCalledWith(TEST_CODE);
    });

    it('returns newActionResponseBuilder', function() {
        expect(handler(formInput(parameters), draftMock, services)).toBe(cardServiceMock.newActionResponseBuilderMock);
    });

    it('newActionResponseBuilder gets built', function() {
        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newActionResponseBuilderMock.build).toHaveBeenCalled();
    });

    it('sets navigation to newNavigation', function() {
        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newActionResponseBuilderMock.setNavigation).toHaveBeenCalledWith(cardServiceMock.newNavigationMock);
    });

    it('navigation is pushed with AttachmentCard', function() {
        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ATTACHMENT_CARD);
    });
    
    it('AttachmentCard is given list of attachments from mail attachment service', function() {
        handler(formInput(parameters), draftMock, services);

        expect(AttachmentCard).toHaveBeenCalledWith(TEST_ATTACHMENT_CARD_ATTACHMENTS);
    });

    describe('ErrorMessageCard is created with correct parameters', function() {
        describe('based on document type it sets different titles', function() {
            beforeEach(function() {
                parameters[Fields.AddressInfo.UserCodeId] = undefined;
            });

            it('document type is inngående', function() {
                draftMock.getDocumentType.and.returnValue("I");

                handler(formInput(parameters), draftMock, services);

                expect(ErrorMessageCard).toHaveBeenCalledWith("Avsender - feil", jasmine.anything(), jasmine.anything());
            });

            it('document type is utgående', function() {
                draftMock.getDocumentType.and.returnValue("U");

                handler(formInput(parameters), draftMock, services);

                expect(ErrorMessageCard).toHaveBeenCalledWith("Mottaker - feil", jasmine.anything(), jasmine.anything());
            });
        });

        it('when user provides code only containing whitespace', function() {
            parameters[Fields.AddressInfo.UserCodeId] = "   \t    \t  ";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Du må fylle ut en saksbehandlerkode!');
        });

        it('when user provides empty code', function() {
            parameters[Fields.AddressInfo.UserCodeId] = undefined;

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Du må fylle ut en saksbehandlerkode!');
        });

        it('when user provides code only which does not exist', function() {
            parameters[Fields.AddressInfo.UserCodeId] = "MISSING";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Saksbehandler finnes ikke!');
        });

        it('when user provides code and name which does not exist', function() {
            parameters[Fields.AddressInfo.UserCodeId] = "MISSING: Not, Listed";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Saksbehandler finnes ikke!');
        });

        it('when user provides code and name where code does not exist', function() {
            parameters[Fields.AddressInfo.UserCodeId] = "MISSING: Test, User";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Saksbehandler finnes ikke!');
        });

        it('when user provides empty code and name', function() {
            parameters[Fields.AddressInfo.UserCodeId] = ": Test, User";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Saksbehandler finnes ikke!');
        });

        it('when user provides only code/name delimiter', function() {
            parameters[Fields.AddressInfo.UserCodeId] = ":";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Saksbehandler finnes ikke!');
        });
    });
});