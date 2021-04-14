describe('ActionHandlerSetAttachment', function() {
    function formInput() {
        return { messageMetadata: { messageId: TEST_MESSAGE_ID }, formInput: formInputParams, formInputs: formInputsParams };
    };

    var handler = ActionHandlers[Actions.Attachment.SetAttachment], formInputParams, formInputsParams, original_summaryCard, draftMock, services, mailAttachmentsServiceMock;
    var TEST_SUMMARY_CARD = "builtSummaryCard";
    var TEST_MESSAGE_ID = "16156c7d6e456302";

    beforeEach(function() {
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['setAttachment']);
        original_summaryCard = SummaryCard;
        mailAttachmentsServiceMock = jasmine.createSpyObj('MailAttachmentsService', ['getAttachments']);
        mailAttachmentsServiceMock.getAttachments.and.returnValue([{ "id": "68dbdf13b423ade4121dd9466ebc4362", "text": "Mail attachment", "isImportable": "true" }, { "id": "1", "text": "some_file.pdf", "isImportable": "true" }, { "id": "2", "text": "vedlegg.txt", "isImportable": "true" }]);
        SummaryCard = jasmine.createSpy('SummaryCard');
        SummaryCard.and.returnValue(TEST_SUMMARY_CARD);

        formInputParams = {};
        formInputParams[Fields.Attachment.MainDocument] = "1";
        formInputsParams = {};
        formInputsParams[Fields.Attachment.Attachments] = ["1", "2"];

        services = { MailAttachments: mailAttachmentsServiceMock };

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        SummaryCard = original_summaryCard;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.Attachment.SetAttachment]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.Attachment.SetAttachment])).toBe("function");
    });

    it('returns newActionResponseBuilder', function() {
        expect(handler(formInput(formInputParams), draftMock, services)).toBe(cardServiceMock.newActionResponseBuilderMock);
    });

    it('newActionResponseBuilder gets built', function() {
        handler(formInput(formInputParams), draftMock, services);

        expect(cardServiceMock.newActionResponseBuilderMock.build).toHaveBeenCalled();
    });

    it('sets navigation to newNavigation', function() {
        handler(formInput(formInputParams), draftMock, services);

        expect(cardServiceMock.newActionResponseBuilderMock.setNavigation).toHaveBeenCalledWith(cardServiceMock.newNavigationMock);
    });

    it('navigation is pushed with SummaryCard', function() {
        handler(formInput(formInputParams), draftMock, services);

        expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_SUMMARY_CARD);
    });

    it('passes journalPostDraft to SummaryCard', function() {
        handler(formInput(formInputParams), draftMock, services);

        expect(SummaryCard).toHaveBeenCalledWith(draftMock);
    });

    it('sets selected items in JournalPostDraft', function() {
        handler(formInput(formInputParams), draftMock, services);

        expect(draftMock.setAttachment).toHaveBeenCalledWith([{ id: "1", text: "some_file.pdf", main: true }, { id: "2", text: "vedlegg.txt", main: false }]);
    });

    it('when main document is not selected in attachment list it gets included anyway', function() {
        formInputParams[Fields.Attachment.MainDocument] = "68dbdf13b423ade4121dd9466ebc4362";

        handler(formInput(formInputParams), draftMock, services);

        expect(draftMock.setAttachment).toHaveBeenCalledWith([{ id: "68dbdf13b423ade4121dd9466ebc4362", text: "Mail attachment", main: true }, { id: "1", text: "some_file.pdf", main: false }, { id: "2", text: "vedlegg.txt", main: false }]);
    });

    it('no attachments are selected in attachment list only main document is included', function() {
        formInputParams[Fields.Attachment.MainDocument] = "68dbdf13b423ade4121dd9466ebc4362";
        formInputsParams[Fields.Attachment.Attachments] = undefined;

        handler(formInput(formInputParams), draftMock, services);

        expect(draftMock.setAttachment).toHaveBeenCalledWith([{ id: "68dbdf13b423ade4121dd9466ebc4362", text: "Mail attachment", main: true }]);
    });
});
