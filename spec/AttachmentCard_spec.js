describe('AttachmentCard', function() {
    var card, cardServiceMock, attachments, attachment, mailAttachment;

    beforeEach(function() {
        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
        mailAttachment = { "id": "68dbdf13b423ade4121dd9466ebc4362", "text": "Test title", "isImportable": true };
        attachment = { "id": "1", "text": "some_attachment.jpg", "isImportable": true };
        attachments = [mailAttachment];
    });

    function createCard() {
        return AttachmentCard(attachments);
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

            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.Attachment.CardTitle);
        });

        it('sets correct header image url', function() {
            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.Attachments);
        });
    });

    describe('main document section is added correctly', function() {
        it('section header text is set correctly', function() {
            card = createCard();

            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith("Velg hoveddokument");
        });

        it('section is added to card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });

        describe('main document selection input', function() {
            it('has correct field name', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setFieldName).toHaveBeenCalledWith('f_attachment_maindocument_id');
            });

            it('has correct type', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setType).toHaveBeenCalledWith(CardService.SelectionInputType.RADIO_BUTTON);
            });

            it('has correct title', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].setTitle).toHaveBeenCalledWith("Dokumenter");
            });

            it('adds first attachment to selection input', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[0].addItem).toHaveBeenCalledWith("Test title", "68dbdf13b423ade4121dd9466ebc4362", true);
            });

            it('adds second attachment to selection input', function() {
                attachments.push(attachment);

                card = createCard();

                expect(cardServiceMock.widgetMocks[0].addItem).toHaveBeenCalledWith("some_attachment.jpg", "1", false);
            });

            it('does not add attachments that are not importable', function() {
                attachment.isImportable = false;
                attachments.push(attachment);

                card = createCard();

                expect(cardServiceMock.widgetMocks[0].addItem).not.toHaveBeenCalledWith("some_attachment.jpg", "1", false);
            });
        });
    });

    describe('attachments section is added correctly', function() {
        it('section header text is set correctly', function() {
            card = createCard();

            expect(cardServiceMock.sectionMocks[1].setHeader).toHaveBeenCalledWith("Velg vedlegg");
        });

        it('section is added to card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[1]);
        });

        describe('attachment selection input', function() {
            it('has correct field name', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[1].setFieldName).toHaveBeenCalledWith('f_attachment_attachments_id');
            });

            it('has correct type', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[1].setType).toHaveBeenCalledWith(CardService.SelectionInputType.CHECK_BOX);
            });

            it('has correct title', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[1].setTitle).toHaveBeenCalledWith("Vedlegg");
            });

            it('adds first attachment to selection input', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[1].addItem).toHaveBeenCalledWith("Test title", "68dbdf13b423ade4121dd9466ebc4362", true);
            });

            it('adds second attachment to selection input', function() {
                attachments.push(attachment);

                card = createCard();

                expect(cardServiceMock.widgetMocks[1].addItem).toHaveBeenCalledWith("some_attachment.jpg", "1", true);
            });

            it('does not add attachments that are not importable', function() {
                attachment.isImportable = false;
                attachments.push(attachment);

                card = createCard();

                expect(cardServiceMock.widgetMocks[1].addItem).not.toHaveBeenCalledWith("some_attachment.jpg", "1", jasmine.anything());

            });

            it('adds text paragraph for list of non importable attachments', function() {
                attachment.isImportable = false;
                attachments.push(attachment);

                card = createCard();

                expect(cardServiceMock.sectionMocks[1].addWidget).toHaveBeenCalledWith(cardServiceMock.widgetMocks[2]);
            });

            it('adds attachments that are not importable to a text list indicating they cannot be added', function() {
                attachment.isImportable = false;
                attachments.push(attachment);
                attachments.push({ "id": "2", "text": "cannot_be_added.exe", "isImportable": false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[2].setText).toHaveBeenCalledWith("Følgende filer støttes ikke i Websak:<br><i>some_attachment.jpg</i><br><i>cannot_be_added.exe</i>");

            });

            describe('text button widget', function() {
                it('text is correct', function() {
                    card = createCard();

                    expect(cardServiceMock.widgetMocks[2].setText).toHaveBeenCalledWith(Strings.Attachment.SetAttachmentsButtonText);
                });

                it('function name points to correct handler function', function() {
                    card = createCard();

                    expect(cardServiceMock.actionMocks[0].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
                });

                it('sets action origins parameters', function() {
                    card = createCard();
                    
                    expect(cardServiceMock.actionMocks[0].setParameters).toHaveBeenCalledWith({ action: Actions.Attachment.SetAttachment });
                });
            });
            
            it('does not add unsupported file tips when no unsupported files exists', function() {
                card = createCard();
                
                expect(cardServiceMock.widgetMocks[3]).toBe(undefined);
            });

            describe('adds unsupported file tips when there is unsupported files in attachment list', function() {
                beforeEach(function() {
                    attachments.push({ "id": "2", "text": "cannot_be_added.exe", "isImportable": false });
                });

                it('label value is correct', function() {
                    card = createCard();

                    expect(cardServiceMock.widgetMocks[4].setTopLabel).toHaveBeenCalledWith(Strings.Common.TipsAndTricks);
                });

                it('content is set to tips text', function() {
                    card = createCard();

                    expect(cardServiceMock.widgetMocks[4].setContent).toHaveBeenCalledWith(Strings.Attachment.UnsupportedFilesTips);
                });

                it('turns on multiline text', function() {
                    card = createCard();

                    expect(cardServiceMock.widgetMocks[4].setMultiline).toHaveBeenCalledWith(true);
                });

                it('set icon address to tips and tricks icon URL', function() {
                    card = createCard();

                    expect(cardServiceMock.widgetMocks[4].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.TipsAndTricks);
                });
            });
        });
    });
});