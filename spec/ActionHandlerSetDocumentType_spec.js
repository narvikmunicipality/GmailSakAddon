describe('ActionHandlerSetDocumentType', function() {
    function formInput(parameters) {
        return { messageMetadata: { messageId: TEST_MESSAGE_ID }, formInput: parameters };
    };

    var handler = ActionHandlers[Actions.DocumentType.SetDocumentType], parameters, original_addressInfoCard, original_attachmentCard, draftMock, services, addressInfoPrefillMock;
    var TEST_DOCUMENT_INNGAENDE_TYPE = "I";
    var TEST_DOCUMENT_UTGAENDE_TYPE = "U";
    var TEST_DOCUMENT_XNOTAT_TYPE = "X";
    var TEST_ADDRESSINFO_CARD = "builtAddressInfoCard";
    var TEST_ATTACHMENT_CARD = "builtAttachmentCard";
    var TEST_MESSAGE_ID = "16156c7d6e456302";
    var TEST_ATTACHMENT_CARD_ATTACHMENTS = 'TestAttachments';

    beforeEach(function() {
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['setDocumentType', 'getDocumentType']);
        original_addressInfoCard = AddressInfoCard;
        original_attachmentCard = AttachmentCard;
        AddressInfoCard = jasmine.createSpy('AddressInfoCard');
        AddressInfoCard.and.returnValue(TEST_ADDRESSINFO_CARD);
        AttachmentCard = jasmine.createSpy('AttachmentCard');
        AttachmentCard.and.returnValue(TEST_ATTACHMENT_CARD);
        addressInfoPrefillMock = jasmine.createSpy('AddressInfoPrefillService');
        mailAttachmentsServiceMock = jasmine.createSpyObj('MailAttachmentsService', ['getAttachments']);
        mailAttachmentsServiceMock.getAttachments.and.returnValue(TEST_ATTACHMENT_CARD_ATTACHMENTS);

        parameters = {};
        parameters[Fields.DocumentType.Id] = TEST_DOCUMENT_INNGAENDE_TYPE;

        services = { AddressInfoPrefill: addressInfoPrefillMock, MailAttachments: mailAttachmentsServiceMock };

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        AddressInfoCard = original_addressInfoCard;
        AttachmentCard = original_attachmentCard;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.DocumentType.SetDocumentType]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.DocumentType.SetDocumentType])).toBe("function");
    });

    it('sets type in JournalPostDraft', function() {
        handler(formInput(parameters), draftMock, services);

        expect(draftMock.setDocumentType).toHaveBeenCalledWith(TEST_DOCUMENT_INNGAENDE_TYPE);
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

    describe('document type is inngående', function() {
        beforeEach(function() {
            parameters[Fields.DocumentType.Id] = [TEST_DOCUMENT_INNGAENDE_TYPE];
            draftMock.getDocumentType.and.returnValue("I");
        });

        it('navigation is pushed with AddressInfoCard', function() {
            handler(formInput(parameters), draftMock, services);

            expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ADDRESSINFO_CARD);
        });

        it('passes messageId and journalpostdraft to AddressInfoCard', function() {
            handler(formInput(parameters), draftMock, services);

            expect(AddressInfoCard).toHaveBeenCalledWith(TEST_MESSAGE_ID, draftMock, jasmine.anything());
        });
    });

    describe('document type is utgående', function() {
        beforeEach(function() {
            parameters[Fields.DocumentType.Id] = [TEST_DOCUMENT_UTGAENDE_TYPE];
            draftMock.getDocumentType.and.returnValue("U");
        });

        it('navigation is pushed with AddressInfoCard', function() {
            handler(formInput(parameters), draftMock, services);

            expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ADDRESSINFO_CARD);
        });

        it('passes messageId to AddressInfoCard', function() {
            handler(formInput(parameters), draftMock, services);

            expect(AddressInfoCard).toHaveBeenCalledWith(TEST_MESSAGE_ID, jasmine.anything(), jasmine.anything());
        });

        it('passes journalpostdraft to AddressInfoCard', function() {
            handler(formInput(parameters), draftMock, services);

            expect(AddressInfoCard).toHaveBeenCalledWith(jasmine.anything(), draftMock, jasmine.anything());
        });

        it('passes addressinfoprefillservice to AddressInfoCard', function() {
            handler(formInput(parameters), draftMock, services);

            expect(AddressInfoCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), addressInfoPrefillMock);
        });
    });

    describe('document type is internt notat', function() {
        beforeEach(function() {
            parameters[Fields.DocumentType.Id] = [TEST_DOCUMENT_XNOTAT_TYPE];
            draftMock.getDocumentType.and.returnValue("X");
        });

        it('passes attachments to AttachmentCard', function() {
            handler(formInput(parameters), draftMock, services);

            expect(AttachmentCard).toHaveBeenCalledWith(TEST_ATTACHMENT_CARD_ATTACHMENTS);
        });

        it('navigation is pushed with AttachmentCard', function() {
            handler(formInput(parameters), draftMock, services);

            expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ATTACHMENT_CARD);
        });
    });
});
