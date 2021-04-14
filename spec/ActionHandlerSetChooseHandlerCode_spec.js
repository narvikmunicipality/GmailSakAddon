describe('ActionHandlerSetChooseHandlerCode', function() {
    function formInput(parameters) {
        return { messageMetadata: { messageId: TEST_TITLE_CARD_MESSAGE_ID }, formInput: parameters };
    };

    var handler = ActionHandlers[Actions.ChooseHandler.SetHandlerCode], parameters, original_titleCard, original_errorMessageCard, original_chooseHandlerCodeService, chooseHandlerCodeServiceMock, draftMock, services;
    var TEST_CODE = "TEST_CODE", TEST_TITLE_CARD = "builtTitleCard", TEST_ERROR_MESSAGE_CARD = "builtErrorMessageCard", TEST_TITLE_CARD_MESSAGE_ID = 'TestMessageId';

    beforeEach(function() {
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['setHandler']);
        original_titleCard = TitleCard;
        original_errorMessageCard = ErrorMessageCard;
        original_chooseHandlerCodeService = ChooseHandlerCodeService;
        TitleCard = jasmine.createSpy('TitleCard');
        TitleCard.and.returnValue(TEST_TITLE_CARD);
        ErrorMessageCard = jasmine.createSpy('ErrorMessageCard');
        ErrorMessageCard.and.returnValue(TEST_ERROR_MESSAGE_CARD);
        chooseHandlerCodeServiceMock = jasmine.createSpyObj('ChooseHandlerCodeService', ['getSuggestions']);
        chooseHandlerCodeServiceMock.getSuggestions.and.returnValue(['TEST_CODE: Test, User', 'ANOTHER1: Another, Decoy', 'ANOTHER: Another, Test',]);

        services = { ChooseHandlerCode: chooseHandlerCodeServiceMock };

        parameters = {};
        parameters[Fields.ChooseHandler.HandlerCodeId] = TEST_CODE;

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        TitleCard = original_titleCard;
        ErrorMessageCard = original_errorMessageCard
        CodeService = original_chooseHandlerCodeService;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.ChooseHandler.SetHandlerCode]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.ChooseHandler.SetHandlerCode])).toBe("function");
    });

    describe('sets handler code in JournalPostDraft', function() {
        it('when user provides code that matches result from server', function() {
            handler(formInput(parameters), draftMock, services);

            expect(draftMock.setHandler).toHaveBeenCalledWith('TEST_CODE: Test, User');
        });

        it('when user provides code and name that matches result from server', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = 'ANOTHER: Another, Test';

            handler(formInput(parameters), draftMock, services);

            expect(draftMock.setHandler).toHaveBeenCalledWith('ANOTHER: Another, Test');
        });

        it('when user provides valid code but modified name it uses result from server from matching code', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = 'ANOTHER: Name, Modified';

            handler(formInput(parameters), draftMock, services);

            expect(draftMock.setHandler).toHaveBeenCalledWith('ANOTHER: Another, Test');
        });

        it('when user provides valid code but in lowercase it uses result from server from matching code', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = 'another';

            handler(formInput(parameters), draftMock, services);

            expect(draftMock.setHandler).toHaveBeenCalledWith('ANOTHER: Another, Test');
        });
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

    it('navigation is pushed with TitleCard', function() {
        handler(formInput(parameters), draftMock, services);

        expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_TITLE_CARD);
    });

    it('TitleCard is given messageId', function() {
        handler(formInput(parameters), draftMock, services);

        expect(TitleCard).toHaveBeenCalledWith(TEST_TITLE_CARD_MESSAGE_ID);
    });

    describe('ErrorMessageCard is created with correct parameters', function() {
        it('card title has correct text', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = undefined;

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith("Saksbehandler - feil", "Velg saksbehandler", jasmine.anything());
        });

        it('when user provides code only containing whitespace', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = "   \t    \t  ";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'Du må fylle ut en saksbehandlerkode!');
        });

        it('when user provides empty code', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = undefined;

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'Du må fylle ut en saksbehandlerkode!');
        });

        it('when user provides code only which does not exist', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = "MISSING";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'Saksbehandlerkoden finnes ikke!');
        });

        it('when user provides code and name which does not exist', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = "MISSING: Not, Listed";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'Saksbehandlerkoden finnes ikke!');
        });

        it('when user provides code and name where code does not exist', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = "MISSING: Test, User";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'Saksbehandlerkoden finnes ikke!');
        });

        it('when user provides empty code and name', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = ": Test, User";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'Saksbehandlerkoden finnes ikke!');
        });

        it('when user provides only code/name delimiter', function() {
            parameters[Fields.ChooseHandler.HandlerCodeId] = ":";

            handler(formInput(parameters), draftMock, services);

            expect(ErrorMessageCard).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'Saksbehandlerkoden finnes ikke!');
        });
    });
});
