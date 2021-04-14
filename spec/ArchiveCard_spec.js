describe('ArchiveCard', function() {
    var card, cardServiceMock, lastUsedArchiveId;

    beforeEach(function() {
        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
        lastUsedArchiveId = { "archiveid": "", "archivetitle": "" };
        importedJournalPostId = "0";
    });

    function createCard() {
        return ArchiveCard(lastUsedArchiveId, importedJournalPostId);
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

            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.ArchiveId.CardTitle);
        });

        it('sets correct header image url', function() {
            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.ArchiveId);
        });
    });

    describe('ArchiveID section is added correctly', function() {
        it('section header text is set correctly', function() {
            card = createCard();

            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith(Strings.ArchiveId.CardHeaderTitle);
        });

        it('section is added to card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });

        describe('text input widget', function() {
            it('field name is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setFieldName).toHaveBeenCalledWith(Fields.ArchiveId.Id);
            });

            it('title is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setTitle).toHaveBeenCalledWith(Strings.ArchiveId.ArchiveIdTitle);
            });

            it('when last used archive id value is empty it sets value to empty string', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setValue).toHaveBeenCalledWith('');
            });

            it('when last used archive id contains id it is set as value', function() {
                var expectedValue = "2018000001";
                lastUsedArchiveId.archiveid = expectedValue;

                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setValue).toHaveBeenCalledWith(expectedValue);
            });
        });

        it('when imported journal post id value is empty it does not add keyvalue widget', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks.length).toEqual(3);
        });

        describe('adds import log key value widget when imported journal post id is set', function() {
            beforeEach(function() {
                importedJournalPostId = "2018000002";
            });

            it('text value is correct', function() {

                card = createCard();

                expect(cardServiceMock.widgetMocks[1].setTopLabel).toHaveBeenCalledWith(Strings.ArchiveId.ImportLogTitle);
            });

            it('imported journal post id is set as value', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[1].setContent).toHaveBeenCalledWith("2018000002");
            });

            it('set icon address to information icon URL', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[1].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.Information);
            });
        });

        describe('text button widget', function() {
            it('text is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[1].setText).toHaveBeenCalledWith(Strings.ArchiveId.SetArchiveIdText);
            });

            it('function name points to correct handler function', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[0].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
            });

            it('sets action origins parameters', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[0].setParameters).toHaveBeenCalledWith({ action: Actions.ArchiveId.SetId });
            });
        });

        describe('adds search tips', function() {
            it('label value is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[2].setTopLabel).toHaveBeenCalledWith(Strings.Common.TipsAndTricks);
            });

            it('content is set to tips text', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[2].setContent).toHaveBeenCalledWith(Strings.ArchiveId.SearchTips);
            });

            it('turns on multiline text', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[2].setMultiline).toHaveBeenCalledWith(true);
            });

            it('set icon address to tips and tricks icon URL', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[2].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.TipsAndTricks);
            });
        });

    });
});