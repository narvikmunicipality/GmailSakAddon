describe('ErrorMessageCard', function() {
    var EXPECTED_TITLE = 'Test title', EXPECTED_CARDHEADER_TITLE = 'Test Header Title', EXPECTED_INFORMATION_TEXT = 'Test information';
    var card, cardServiceMock;

    beforeEach(function() {
        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    function createCard() {
        return ErrorMessageCard(EXPECTED_TITLE, EXPECTED_CARDHEADER_TITLE, EXPECTED_INFORMATION_TEXT);
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

        it('sets header title to supplied value', function() {
            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(EXPECTED_TITLE);
        });

        it('sets correct header image url', function() {
            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.Error);
        });
    });

    describe('message section is added correctly', function() {
        it('section header text is set to supplied value', function() {
            card = createCard();

            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith(EXPECTED_CARDHEADER_TITLE);
        });

        it('section is added to card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });

        describe('information text paragraph widget', function() {
            it('text is set to supplied value', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setText).toHaveBeenCalledWith(EXPECTED_INFORMATION_TEXT);
            });
        });
    });
});