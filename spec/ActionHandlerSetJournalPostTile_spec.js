describe('ActionHandlerSetJournalPostTitle', function() {
    function formInput(parameters) {
        return { formInput: parameters };
    };

    var handler = ActionHandlers[Actions.JournalPostTitle.SetTitle], parameters, original_documentTypeCard, draftMock, original_errorMessageCard, mailMetadataServiceMock;
    var TEST_TITLE = "Test title";
    var TEST_DOCUMENT_TYPE_CARD = "builtDocumentTypeCard";
    var TEST_ERROR_MESSAGE_CARD = "builtErrorMessageCard";
    var TEST_ACTIVE_USER_FLAG = "actual value will be boolean";

    beforeEach(function() {
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['setJournalPostTitle']);
        original_documentTypeCard = DocumentTypeCard;
        original_errorMessageCard = ErrorMessageCard;
        DocumentTypeCard = jasmine.createSpy('DocumentTypeCard');
        DocumentTypeCard.and.returnValue(TEST_DOCUMENT_TYPE_CARD);
        ErrorMessageCard = jasmine.createSpy('ErrorMessageCard');
        ErrorMessageCard.and.returnValue(TEST_ERROR_MESSAGE_CARD);
        mailMetadataServiceMock = jasmine.createSpyObj('MailMetadataService', ['isActiveUserSender']);
        mailMetadataServiceMock.isActiveUserSender.and.returnValue(TEST_ACTIVE_USER_FLAG);

        parameters = {};
        parameters[Fields.JournalPostTitle.Id] = TEST_TITLE;

        services = { MailMetadata: mailMetadataServiceMock };

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        DocumentTypeCard = original_documentTypeCard;
        ErrorMessageCard = original_errorMessageCard;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.JournalPostTitle.SetTitle]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.JournalPostTitle.SetTitle])).toBe("function");
    });

    it('sets title in journalPostDraft', function() {
        handler(formInput(parameters), draftMock, services);

        expect(draftMock.setJournalPostTitle).toHaveBeenCalledWith(TEST_TITLE);
    });

    it('navigation is pushed with ErrorCard when user provides empty title', function() {
        parameters[Fields.JournalPostTitle.Id] = undefined;

        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ERROR_MESSAGE_CARD);
    });

    it('when user provides empty title ErrorMessageCard is created with correct parameters', function() {
        parameters[Fields.JournalPostTitle.Id] = undefined;

        handler(formInput(parameters), draftMock, services);

        expect(ErrorMessageCard).toHaveBeenCalledWith('Journalpost - feil', 'Skriv inn tittel', 'Du må skrive inn en tittel!');
    });
    
    it('when user provides title only containing whitespace an ErrorMessageCard is created with correct parameters', function() {
        parameters[Fields.JournalPostTitle.Id] = "   \t    \t  ";

        handler(formInput(parameters), draftMock, services);

        expect(ErrorMessageCard).toHaveBeenCalledWith('Journalpost - feil', 'Skriv inn tittel', 'Du må skrive inn en tittel!');
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

    it('navigation is pushed with DocumentTypeCard', function() {
        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_DOCUMENT_TYPE_CARD);
    });

    it('passes flag from MailMetadataService if active user is sender to DocumentTypeCard', function() {
        handler(formInput(parameters), draftMock, services);

        expect(DocumentTypeCard).toHaveBeenCalledWith(TEST_ACTIVE_USER_FLAG);
    });
});
