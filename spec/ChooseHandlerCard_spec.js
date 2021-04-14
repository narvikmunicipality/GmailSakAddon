describe('ChooseHandlerCard', function() {
    var card, cardServiceMock;

    beforeEach(function() {
        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    function createCard() {
        return ChooseHandlerCard();
    }

    it('creates new cardbuilder with CardService', function() {
        card = createCard();

        expect(CardService.newCardBuilder).toHaveBeenCalled();
    });

    it('returns card when created', function() {
        card = createCard();

        expect(card).toBe(cardServiceMock.newCardBuilderMock);
    });

    it('created card is built when returned', function() {
        card = createCard();

        expect(cardServiceMock.newCardBuilderMock.build).toHaveBeenCalled();
    });

    describe('Header is created correctly', function() {
        it('sets header on created card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.setHeader).toHaveBeenCalledWith(cardServiceMock.newCardHeaderMock);
        });

        it('sets correct header title', function() {
            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.ChooseHandler.CardTitle);
        });

        it('sets correct header image url', function() {
            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.ChooseHandler);
        });
    });

    describe('handler code section is added correctly', function() {
        it('section header text is set correctly', function() {
            card = createCard();

            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith(Strings.ChooseHandler.CardHeaderTitle);
        });

        it('section is added to card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });

        describe('handler code widget', function() {
            it('field name is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setFieldName).toHaveBeenCalledWith(Fields.ChooseHandler.HandlerCodeId);
            });

            it('title is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setTitle).toHaveBeenCalledWith(Strings.ChooseHandler.HandlerCodeTextTitle);
            });

            it('suggestions action is correct', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[0].setFunctionName).toHaveBeenCalledWith(System.ChooseHandlerCodeSuggestionsFunction);
            });

            it('suggestions action is set on textinput', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setSuggestionsAction).toHaveBeenCalledWith(cardServiceMock.actionMocks[0]);
            });
        });

        describe('text button widget', function() {
            it('text is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[1].setText).toHaveBeenCalledWith(Strings.ChooseHandler.SetHandlerCodeButtonText);
            });

            it('function name points to correct handler function', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[1].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
            });

            it('sets action origins parameters', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[1].setParameters).toHaveBeenCalledWith({ action: Actions.ChooseHandler.SetHandlerCode });
            });
        });
    });
});