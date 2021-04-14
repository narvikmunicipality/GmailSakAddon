describe('ActionHandlerSetArchiveId', function() {
    function formInput(parameters) {
        return { messageMetadata: { messageId: TEST_MESSAGE_ID }, formInput: parameters };
    };

    var handler = ActionHandlers[Actions.ArchiveId.SetId], parameters, original_titleCard, original_errorMessageCard, original_chooseHandlerCard, draftMock, services, resultWithError, resultWithValue, expectedSetArchiveValue, archiveIdServiceMock, websakCheckServiceMock;
    var TEST_ID = "2018000001";
    var TEST_TITLE_CARD = "builtTitleCard", TEST_CHOOSEHANDLER_CARD = 'builtChooseHandlerCard';
    var TEST_MESSAGE_ID = "16156c7d6e456302";
    var TEST_ERROR_MESSAGE_CARD = 'builtErrorMessageCard';

    beforeEach(function() {
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['setArchiveId']);
        original_titleCard = TitleCard;
        original_errorMessageCard = ErrorMessageCard;
        original_chooseHandlerCard = ChooseHandlerCard;
        ErrorMessageCard = jasmine.createSpy('ErrorMessageCard');
        ErrorMessageCard.and.returnValue(TEST_ERROR_MESSAGE_CARD);
        TitleCard = jasmine.createSpy('TitleCard');
        TitleCard.and.returnValue(TEST_TITLE_CARD);
        ChooseHandlerCard = jasmine.createSpy('ChooseHandlerCard');
        ChooseHandlerCard.and.returnValue(TEST_CHOOSEHANDLER_CARD);
        Utilities = jasmine.createSpyObj('Utilities', ['getUuid']);

        expectedSetArchiveValue = { "archiveid": TEST_ID, "archivetitle": "Test title" };
        resultWithValue = JSON.stringify(expectedSetArchiveValue);
        resultWithError = JSON.stringify({ "searchError": "Test error" });
        archiveIdServiceMock = jasmine.createSpyObj('ArchiveId', ['get']);
        archiveIdServiceMock.get.and.returnValue(resultWithValue);
        websakCheckServiceMock = jasmine.createSpyObj('WebsakCheckService', ['getUserStatus']);
        websakCheckServiceMock.getUserStatus.and.returnValue({ "chooseHandler": false });
        services = { ArchiveId: archiveIdServiceMock, WebsakCheck: websakCheckServiceMock };

        parameters = {};
        parameters[Fields.ArchiveId.Id] = TEST_ID;

        spyOn(console, 'log');

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        TitleCard = original_titleCard;
        ErrorMessageCard = original_errorMessageCard;
        ChooseHandlerCard = original_chooseHandlerCard
        delete Utilities;
    });

    describe('action handler is setup correctly', function() {
        it('is defined in ActionHandlers', function() {
            expect(ActionHandlers[Actions.ArchiveId.SetId]).not.toBeUndefined();
        });

        it('ActionHandler is function', function() {
            expect(typeof (ActionHandlers[Actions.ArchiveId.SetId])).toBe("function");
        });
    });

    it('uses full id in JournalPostDraft when searching with full id', function() {
        archiveIdServiceMock.get.and.returnValue(resultWithValue);

        handler(formInput(parameters), draftMock, services);

        expect(draftMock.setArchiveId).toHaveBeenCalledWith(expectedSetArchiveValue);
    });

    it('uses full id in JournalPostDraft when searching with shorthand id', function() {
        archiveIdServiceMock.get.and.returnValue(resultWithValue);
        parameters[Fields.ArchiveId.Id] = '18/1';

        handler(formInput(parameters), draftMock, services);

        expect(draftMock.setArchiveId).toHaveBeenCalledWith(expectedSetArchiveValue);
    });

    it('navigation is pushed with error card when service returns search error', function() {
        archiveIdServiceMock.get.and.returnValue(resultWithError);
        parameters[Fields.ArchiveId.Id] = '18/0';

        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ERROR_MESSAGE_CARD);
    });

    it('error card is provied with correct parameters when service returns search error', function() {
        archiveIdServiceMock.get.and.returnValue(resultWithError);
        parameters[Fields.ArchiveId.Id] = '18/0';

        handler(formInput(parameters), draftMock, services);

        expect(ErrorMessageCard).toHaveBeenCalledWith("Arkivsak - feil", "Velg arkivsak", "Test error");
    });

    it('error card message when user has not filled in id', function() {
        parameters[Fields.ArchiveId.Id] = undefined;

        handler(formInput(parameters), draftMock, services);

        expect(ErrorMessageCard).toHaveBeenCalledWith("Arkivsak - feil", "Velg arkivsak", "Du må fylle inn et arkivsaknummer!");
    });


    it('error card gets custom message when service returns html error', function() {
        Utilities.getUuid.and.returnValue('UUID-VALUE');
        archiveIdServiceMock.get.and.returnValue('<html>');
        parameters[Fields.ArchiveId.Id] = '18/1';

        handler(formInput(parameters), draftMock, services);

        expect(ErrorMessageCard).toHaveBeenCalledWith("Arkivsak - feil", "Velg arkivsak", "Feil med serverkommunikasjon. Feilsøk-ID: UUID-VALUE");
    });

    it('logs error details when service returns html error', function() {
        Utilities.getUuid.and.returnValue('UUID-VALUE');
        archiveIdServiceMock.get.and.returnValue('<html>');
        parameters[Fields.ArchiveId.Id] = '18/1';

        handler(formInput(parameters), draftMock, services);

        expect(console.log).toHaveBeenCalledWith("ArchiveID handler search result (UUID-VALUE): <html>");
    });

    it('throws exception when something other than SyntaxError is thrown', function() {
        Utilities.getUuid.and.returnValue('UUID-VALUE');
        archiveIdServiceMock.get.and.throwError("TestError - This should be rethrown");
        parameters[Fields.ArchiveId.Id] = '18/1';

        expect(function() { handler(formInput(parameters), draftMock, services); }).toThrowError("TestError - This should be rethrown");
    });

    it('calls ArchiveId service with input from form', function() {
        var testId = '18/1';
        archiveIdServiceMock.get.and.returnValue(resultWithValue);
        parameters[Fields.ArchiveId.Id] = testId;

        handler(formInput(parameters), draftMock, services);

        expect(archiveIdServiceMock.get).toHaveBeenCalledWith(testId);
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

    it('navigation is pushed with TitleCard when chooseHandler is false', function() {
        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_TITLE_CARD);
    });

    it('passes messageId to TitleCard', function() {
        handler(formInput(parameters), draftMock, services);

        expect(TitleCard).toHaveBeenCalledWith(TEST_MESSAGE_ID);
    });

    it('navigation is pushed with ChooseHandlerCard when chooseHandler is true', function() {
        websakCheckServiceMock.getUserStatus.and.returnValue({ "chooseHandler": true });

        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_CHOOSEHANDLER_CARD);
    });
});
