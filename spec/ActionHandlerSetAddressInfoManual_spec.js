describe('ActionHandlerSetAddressInfoManual', function() {
    function formInput(parameters) {
        return { formInput: parameters };
    };

    var handler = ActionHandlers[Actions.AddressInfo.SetAddressInfo], parameters, original_attachmentCard, draftMock, mailAttachmentsServiceMock, services;
    var TEST_NAME = "TEST_NAME", TEST_ADDRESS = "TEST_ADDRESS", TEST_MAIL = "test@example.com", TEST_ZIPCODE = "1234", TEST_CITY = "TESTCITY";
    var TEST_ATTACHMENT_CARD = "builtAttachmentCard", TEST_ERRORMESSAGE_CARD = 'builtErrorMessageCard', TEST_ATTACHMENT_CARD_ATTACHMENTS = 'TestAttachments';

    beforeEach(function() {
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['setAddressInfo', 'getDocumentType']);
        original_attachmentCard = AttachmentCard;
        original_errorMessageCard = ErrorMessageCard;
        AttachmentCard = jasmine.createSpy('AttachmentCard');
        AttachmentCard.and.returnValue(TEST_ATTACHMENT_CARD);
        ErrorMessageCard = jasmine.createSpy('ErrorMessageCard');
        ErrorMessageCard.and.returnValue(TEST_ERRORMESSAGE_CARD);
        mailAttachmentsServiceMock = jasmine.createSpyObj('MailAttachmentsService', ['getAttachments']);
        mailAttachmentsServiceMock.getAttachments.and.returnValue(TEST_ATTACHMENT_CARD_ATTACHMENTS);

        parameters = {};
        parameters[Fields.AddressInfo.FullnameId] = TEST_NAME;
        parameters[Fields.AddressInfo.AddressId] = TEST_ADDRESS;
        parameters[Fields.AddressInfo.MailId] = TEST_MAIL;
        parameters[Fields.AddressInfo.ZipCodeId] = TEST_ZIPCODE;
        parameters[Fields.AddressInfo.CityId] = TEST_CITY;

        services = { MailAttachments: mailAttachmentsServiceMock };

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        AttachmentCard = original_attachmentCard;
        ErrorMessageCard = original_errorMessageCard;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.AddressInfo.SetAddressInfo]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.AddressInfo.SetAddressInfo])).toBe("function");
    });

    it('sets user code in JournalPostDraft', function() {
        handler(formInput(parameters), draftMock, services);

        expect(draftMock.setAddressInfo).toHaveBeenCalledWith({ Name: TEST_NAME, Address: TEST_ADDRESS, Mail: TEST_MAIL, ZipCode: TEST_ZIPCODE, City: TEST_CITY });
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
                parameters[Fields.AddressInfo.FullnameId] = undefined;
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

        it('when user provides name only containing whitespace', function() {
            parameters[Fields.AddressInfo.FullnameId] = "   \t    \t  ";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Du må oppgi et navn!');
        });

        it('when user provides empty code', function() {
            parameters[Fields.AddressInfo.FullnameId] = undefined;

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Legg til manuelt", 'Du må oppgi et navn!');
        });

        it('navigation is pushed with ErrorMessageCard', function() {
            parameters[Fields.AddressInfo.FullnameId] = undefined;

            handler(formInput(parameters), draftMock, services);
    
            expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ERRORMESSAGE_CARD);
        });
    });    
});
