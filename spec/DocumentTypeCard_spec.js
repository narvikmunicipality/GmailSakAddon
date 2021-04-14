describe('DocumentTypeCard', function() {
    var card, cardServiceMock;

    beforeEach(function() {
        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    it('creates new cardbuilder with CardService', function() {
        card = createDocumentTypeCard();

        expect(CardService.newCardBuilder).toHaveBeenCalled();
    });

    it('returns card when created', function() {
        card = createDocumentTypeCard();

        expect(card).toBe(cardServiceMock.newCardBuilderMock);
    });

    it('created card is built when returned', function() {
        card = createDocumentTypeCard();

        expect(cardServiceMock.newCardBuilderMock.build).toHaveBeenCalled();
    });

    describe('Header is created correctly', function() {
        it('sets header on created card', function() {
            card = createDocumentTypeCard();

            expect(cardServiceMock.newCardBuilderMock.setHeader).toHaveBeenCalledWith(cardServiceMock.newCardHeaderMock);
        });

        it('sets correct header title', function() {
            card = createDocumentTypeCard();

            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.DocumentType.CardTitle);
        });

        it('sets correct header image url', function() {
            card = createDocumentTypeCard();

            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.DocumentType);
        });
    });

    describe('Title section is added correctly', function() {
        it('section header text is set correctly', function() {
            card = createDocumentTypeCard();

            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith(Strings.DocumentType.CardHeaderTitle);
        });

        it('section is added to card', function() {
            card = createDocumentTypeCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });

        it('adds two widgets', function() {
            card = createDocumentTypeCard();

            expect(cardServiceMock.sectionMocks[0].addWidget).toHaveBeenCalledTimes(2);
        });

        describe('input selection widget', function() {
            it('field name is correct', function() {
                card = createDocumentTypeCard();

                expect(cardServiceMock.widgetMocks[0].setFieldName).toHaveBeenCalledWith(Fields.DocumentType.Id);
            });

            it('title is correct', function() {
                card = createDocumentTypeCard();

                expect(cardServiceMock.widgetMocks[0].setTitle).toHaveBeenCalledWith(Strings.DocumentType.DocumentTypeListTitleText);
            });

            it('sets type to radio button', function() {
                card = createDocumentTypeCard();

                expect(cardServiceMock.widgetMocks[0].setType).toHaveBeenCalledWith(cardServiceMock.SelectionInputType.RADIO_BUTTON);
            });

            describe('correct types are added', function() {
                it('inngående type is added', function() {
                    card = createDocumentTypeCard();

                    expect(cardServiceMock.widgetMocks[0].addItem).toHaveBeenCalledWith(Strings.DocumentType.DocumentTypeListIngaendeText, Strings.DocumentType.DocumentTypeListIngaendeId, jasmine.anything());
                });

                it('utgående type is added', function() {
                    card = createDocumentTypeCard();

                    expect(cardServiceMock.widgetMocks[0].addItem).toHaveBeenCalledWith(Strings.DocumentType.DocumentTypeListUtgaendeText, Strings.DocumentType.DocumentTypeListUtgaendeId, jasmine.anything());
                });

                it('X-notat type is added', function() {
                    card = createDocumentTypeCard();

                    expect(cardServiceMock.widgetMocks[0].addItem).toHaveBeenCalledWith(Strings.DocumentType.DocumentTypeListXnotatText, Strings.DocumentType.DocumentTypeListXnotatId, jasmine.anything());
                });
            });

            describe('type selected by default is based on whether user is sender or not', function() {
                it('when sender is active user Utgående document type is selected', function() {
                    card = createDocumentTypeCard(true);

                    expect(cardServiceMock.widgetMocks[0].addItem).toHaveBeenCalledWith(Strings.DocumentType.DocumentTypeListUtgaendeText, Strings.DocumentType.DocumentTypeListUtgaendeId, true);
                });
                
                it('when active user is not sender Inngående document type is selected', function() {
                    card = createDocumentTypeCard(false);
                    
                    expect(cardServiceMock.widgetMocks[0].addItem).toHaveBeenCalledWith(Strings.DocumentType.DocumentTypeListIngaendeText, Strings.DocumentType.DocumentTypeListIngaendeId, true);
                });
            });
        });

        describe('text button widget', function() {
            it('text is correct', function() {
                card = createDocumentTypeCard();

                expect(cardServiceMock.widgetMocks[1].setText).toHaveBeenCalledWith(Strings.DocumentType.ChooseDocumentTypeButtonText);
            });

            it('function name points to correct handler function', function() {
                card = createDocumentTypeCard();

                expect(cardServiceMock.actionMocks[0].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
            });

            it('sets action origins parameters', function() {
                card = createDocumentTypeCard();
                
                expect(cardServiceMock.actionMocks[0].setParameters).toHaveBeenCalledWith({ action: Actions.DocumentType.SetDocumentType });
            });
        });
    })

    function createDocumentTypeCard(isActiveUserSender = true)
    {
        return DocumentTypeCard(isActiveUserSender);
    }
});