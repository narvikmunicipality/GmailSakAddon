describe('TitleCard', function() {
    var card, cardServiceMock;
    var TEST_MAIL_SUBJECT = "Test subject";

    beforeEach(function() {
        cardServiceMock = CardServiceHelper();
        gmailAppMock = GmailAppHelper();
        gmailAppMock.getMessageById.and.returnValue({ getSubject: function() { return TEST_MAIL_SUBJECT; }});

        CardService = cardServiceMock;
        GmailApp = gmailAppMock;

        card = TitleCard();
    });

    it('creates new cardbuilder with CardService', function() {
        expect(CardService.newCardBuilder).toHaveBeenCalled();
    });

    it('returns card when created', function() {
        expect(card).toBe(cardServiceMock.newCardBuilderMock);
    });

    it('created card is built when returned', function() {
        expect(cardServiceMock.newCardBuilderMock.build).toHaveBeenCalled();
    });

    describe('Header is created correctly', function() {
        it('sets header on created card', function() {
            expect(cardServiceMock.newCardBuilderMock.setHeader).toHaveBeenCalledWith(cardServiceMock.newCardHeaderMock);
        });

        it('sets correct header title', function() {
            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.JournalPostTitle.CardTitle);
        });

        it('sets correct header image url', function() {
            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.JournalPostTitle);
        });
    });

    describe('Title section is added correctly', function() {
        it('section header text is set correctly', function() {
            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith(Strings.JournalPostTitle.CardHeaderTitle);
        });

        it('adds two widgets', function() {
            expect(cardServiceMock.sectionMocks[0].addWidget).toHaveBeenCalledTimes(2);
        });

        it('section is added to card', function() {
            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });

        describe('text input widget', function() {
            it('field name is correct', function() {
                expect(cardServiceMock.widgetMocks[0].setFieldName).toHaveBeenCalledWith(Fields.JournalPostTitle.Id);
            });

            it('title is correct', function() {
                expect(cardServiceMock.widgetMocks[0].setTitle).toHaveBeenCalledWith(Strings.JournalPostTitle.TitleTextTitle);
            });

            it('sets value to mail subject', function() {
                expect(cardServiceMock.widgetMocks[0].setValue).toHaveBeenCalledWith(TEST_MAIL_SUBJECT);
            });
        });

        describe('text button widget', function() {
            it('text is correct', function() {
                expect(cardServiceMock.widgetMocks[1].setText).toHaveBeenCalledWith(Strings.JournalPostTitle.SetTitleTextText);
            });

            it('function name points to correct handler function', function() {
                expect(cardServiceMock.actionMocks[0].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
            });

            it('sets action origins parameters', function() {
                expect(cardServiceMock.actionMocks[0].setParameters).toHaveBeenCalledWith({ action: Actions.JournalPostTitle.SetTitle });
            });
        });
    })
});