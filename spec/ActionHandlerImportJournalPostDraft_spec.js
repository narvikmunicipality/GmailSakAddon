describe('ActionHandlerImportJournalPostDraft', function() {
    var handler = ActionHandlers[Actions.Summary.StartImport], eventData = undefined, draftMock, services, original_errorMesssageCard, original_importDoneCard, importServiceMock;
    var TEST_ERRORMESSAGE_CARD = "builtErrorMessageCard", TEST_IMPORTDONE_CARD = "builtImportDoneCard", TEST_JOURNALPOST_ID = "2018001337", TEST_ERROR_MESSAGE = "Some error message";

    beforeEach(function() {
        draftMock = jasmine.createSpy("JournalPostDraft");
        original_importDoneCard = ImportDoneCard;
        original_errorMesssageCard = ErrorMessageCard;
        ErrorMessageCard = jasmine.createSpy('ErrorMessageCard');
        ErrorMessageCard.and.returnValue(TEST_ERRORMESSAGE_CARD);
        ImportDoneCard = jasmine.createSpy('ImportDoneCard');
        ImportDoneCard.and.returnValue(TEST_IMPORTDONE_CARD);
        importServiceMock = jasmine.createSpyObj('ImportServiceMock', ['import']);

        services = { Import: importServiceMock };

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        ErrorMessageCard = original_errorMesssageCard;
        ImportDoneCard = original_importDoneCard;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.Summary.StartImport]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.Summary.StartImport])).toBe("function");
    });

    describe('when import is successful', function() {
        beforeEach(function() {
            importServiceMock.import.and.returnValue({ "status": "jp.id", "message": TEST_JOURNALPOST_ID });
        });

        it('returns newActionResponseBuilder', function() {
            expect(handler(eventData, draftMock, services)).toBe(cardServiceMock.newActionResponseBuilderMock);
        });

        it('newActionResponseBuilder gets built', function() {
            handler(eventData, draftMock, services);

            expect(cardServiceMock.newActionResponseBuilderMock.build).toHaveBeenCalled();
        });

        it('sets navigation to newNavigation', function() {
            handler(eventData, draftMock, services);

            expect(cardServiceMock.newActionResponseBuilderMock.setNavigation).toHaveBeenCalledWith(cardServiceMock.newNavigationMock);
        });

        it('navigation is pushed with ImportDoneCard', function() {
            handler(eventData, draftMock, services);

            expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_IMPORTDONE_CARD);
        });

        it('ImportDoneCard is given ID of journalpost from ImportService', function() {
            handler(eventData, draftMock, services);

            expect(ImportDoneCard).toHaveBeenCalledWith(TEST_JOURNALPOST_ID);
        });

        it('imports with journalpostdraft', function() {
            handler(eventData, draftMock, services);

            expect(importServiceMock.import).toHaveBeenCalledWith(draftMock);
        });
    });

    describe('when import fails', function() {
        var TEST_ERROR_RESULT = { "status": "ERROR", "message": TEST_ERROR_MESSAGE }

        it('navigation is pushed with ErrorMessageCard', function() {
            importServiceMock.import.and.returnValue(TEST_ERROR_RESULT);

            handler(eventData, draftMock, services);

            expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ERRORMESSAGE_CARD);
        });

        it('ErrorMessageCard title is set with errormessage from ImportService', function() {
            importServiceMock.import.and.returnValue(TEST_ERROR_RESULT);

            handler(eventData, draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), TEST_ERROR_MESSAGE);
        });

        it('ErrorMessageCard is set with correct title', function() {
            importServiceMock.import.and.returnValue(TEST_ERROR_RESULT);

            handler(eventData, draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith("Import - feil", jasmine.anything(), jasmine.anything());
        });
        
        it('ErrorMessageCard is set with correct header title', function() {
            importServiceMock.import.and.returnValue(TEST_ERROR_RESULT);

            handler(eventData, draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), "Importeringen feilet", jasmine.anything());
        });
    });
});