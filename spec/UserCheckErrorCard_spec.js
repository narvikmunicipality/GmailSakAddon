describe('UserCheckErrorCard', function() {
    var card, cardServiceMock;

    beforeEach(function() {
        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    function createCard() {
        card = UserCheckErrorCard();
    }

    it('creates new cardbuilder with CardService', function() {
        createCard();

        expect(CardService.newCardBuilder).toHaveBeenCalled();
    });

    it('returns card when created', function() {
        createCard();

        expect(card).toBe(cardServiceMock.newCardBuilderMock);
    });

    it('created card is built when returned', function() {
        createCard();

        expect(cardServiceMock.newCardBuilderMock.build).toHaveBeenCalled();
    });

    describe('Header is created correctly', function() {
        beforeEach(function() {
            createCard();
        });

        it('sets header on created card', function() {
            expect(cardServiceMock.newCardBuilderMock.setHeader).toHaveBeenCalledWith(cardServiceMock.newCardHeaderMock);
        });

        it('sets correct header title', function() {
            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.UserCheckError.CardTitle);
        });

        it('sets correct header image url', function() {
            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.Error);
        });
    });

    describe('Error message section is added correctly', function() {
        it('section header text is set correctly', function() {
            createCard();

            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith(Strings.UserCheckError.CardHeaderTitle);
        });

        it('section is added to card', function() {
            createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });

        describe('error text paragraph widget', function() {
            it('text is correct', function() {
                createCard();

                expect(cardServiceMock.widgetMocks[0].setText).toHaveBeenCalledWith(Strings.UserCheckError.UserConfigurationError);
            });
        });

        describe('text button widget', function() {
            it('text is correct', function() {
                createCard();

                expect(cardServiceMock.widgetMocks[1].setText).toHaveBeenCalledWith(Strings.UserCheckError.RetryButtonText);
            });

            it('function name points to correct handler function', function() {
                createCard();

                expect(cardServiceMock.actionMocks[0].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
            });

            it('sets action parameter', function() {
                createCard();

                expect(cardServiceMock.actionMocks[0].setParameters).toHaveBeenCalledWith({ action: Actions.UserCheckError.Retry  });
            });
        });
    })
});