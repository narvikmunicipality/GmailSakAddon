describe('SummaryCard', function() {
    var card, cardServiceMock, original_journalPostDraft, draftMock;
    var expectedArchiveId = "2018000002 - ArkivsakID-tittel", expectedJournalPostTitle = "JournalPostTitleTest", expectedDocumentType = "I";
    var INTERNAL_NOTE_DOCUMENT_TYPE = "X", INCOMING_DOCUMENT_TYPE = "I", OUTGOING_DOCUMENT_TYPE = "U";

    beforeEach(function() {
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['getArchiveId', 'getJournalPostTitle', 'getDocumentType', 'getAttachment', 'getAddressInfo', 'getHandler']);
        draftMock.getArchiveId.and.returnValue({ "archiveid": "2018000002", "archivetitle": "ArkivsakID-tittel" });
        draftMock.getJournalPostTitle.and.returnValue(expectedJournalPostTitle);
        draftMock.getDocumentType.and.returnValue(expectedDocumentType);
        draftMock.getAttachment.and.returnValue([{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }]);
        draftMock.getHandler.and.returnValue('');

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    function createCard() {
        return SummaryCard(draftMock);
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

            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.Summary.CardTitle);
        });

        it('sets correct header image url', function() {
            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.Import);
        });
    });

    describe('section is added correctly', function() {
        it('section header text is set correctly', function() {
            card = createCard();

            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith(Strings.Summary.CardHeaderTitle);
        });

        it('section is added to card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });
    });

    describe('archive id keyvalue is added', function() {
        it('top label is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[0].setTopLabel).toHaveBeenCalledWith(Strings.Summary.ArchiveIdLabel);
        });

        it('content is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[0].setContent).toHaveBeenCalledWith(expectedArchiveId);
        });

        it('icon is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[0].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.ArchiveId);
        });
    });

    describe('handler keyvalue is added', function() {
        var expectedChooseHandler = 'USER1: Test, User [DEPARTMENT]';

        beforeEach(function() {
            draftMock.getHandler.and.returnValue(expectedChooseHandler);
        });

        it('top label is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[1].setTopLabel).toHaveBeenCalledWith(Strings.Summary.ChooseHandlerLabel);
        });

        it('content is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[1].setContent).toHaveBeenCalledWith(expectedChooseHandler);
        });

        it('icon is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[1].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.ChooseHandler);
        });
    });

    describe('journalposttitle keyvalue is added', function() {
        it('top label is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[1].setTopLabel).toHaveBeenCalledWith(Strings.Summary.JournalPostTitleLabel);
        });

        it('content is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[1].setContent).toHaveBeenCalledWith(expectedJournalPostTitle);
        });

        it('icon is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[1].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.JournalPostTitle);
        });
    });

    describe('documenttype keyvalue is added', function() {
        it('top label is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[2].setTopLabel).toHaveBeenCalledWith(Strings.Summary.DocumentTypeLabel);
        });

        it('content is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[2].setContent).toHaveBeenCalledWith("I - Inngående brev");
        });

        it('icon is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[2].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.DocumentType);
        });
    });

    describe('address info keyvalue added correctly', function() {
        describe('top label text is set correctly', function() {
            it('when document type is inngående', function() {
                draftMock.getDocumentType.and.returnValue(INCOMING_DOCUMENT_TYPE);

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setTopLabel).toHaveBeenCalledWith("Avsender");
            });

            it('when document type is utgående', function() {
                draftMock.getDocumentType.and.returnValue(OUTGOING_DOCUMENT_TYPE);

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setTopLabel).toHaveBeenCalledWith("Mottaker");
            });
        });

        describe('when document type is internt notat', function() {
            it('receiver is not added to list', function() {
                draftMock.getDocumentType.and.returnValue(INTERNAL_NOTE_DOCUMENT_TYPE);

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setTopLabel).not.toHaveBeenCalledWith("Mottaker");
                expect(cardServiceMock.widgetMocks.length).toBe(5);
            });
        });

        describe('content is formatted correctly', function() {
            it('gets and correctly formats sender', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Address: 'Testveien 1', Mail: 'test@example.com', ZipCode: '8501', City: 'NARVIK', UserCode: 'TEST', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('TEST - Test Testersen <test@example.com> (Testveien 1 - 8501 NARVIK)');
            });

            it('generates correct summary when sender code is duplicate', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Address: 'Testveien 1', Mail: 'test@example.com', ZipCode: '8501', City: 'NARVIK', UserCode: 'TEST', Duplicate: true });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen <test@example.com> (Testveien 1 - 8501 NARVIK)');
            });

            it('generate correct summary when sender is missing address1', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Mail: 'test@example.com', ZipCode: '8501', City: 'NARVIK', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen <test@example.com> (8501 NARVIK)');
            });

            it('generate correct summary when sender is missing mail', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Address: 'Testveien 1', ZipCode: '8501', City: 'NARVIK', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen (Testveien 1 - 8501 NARVIK)');
            });

            it('generate correct summary when sender is missing both address1 and mail', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', ZipCode: '8501', City: 'NARVIK', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen (8501 NARVIK)');
            });

            it('generate correct summary when sender is missing address1, mail and zip', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', City: 'NARVIK', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen (NARVIK)');
            });

            it('generate correct summary when sender only have zip code', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', ZipCode: '8501', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen (8501)');
            });

            it('generate correct summary when sender only have mail', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Mail: 'test@example.com', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen <test@example.com>');
            });

            it('generate correct summary when sender only have address1', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Address: 'Testveien 1', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen (Testveien 1)');
            });

            it('generate correct summary when sender only have address1 and zip code', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Address: 'Testveien 1', ZipCode: '8501', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen (Testveien 1 - 8501)');
            });

            it('generate correct summary when sender only have mail and city', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Mail: 'test@example.com', City: 'NARVIK', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('Test Testersen <test@example.com> (NARVIK)');
            });

            it('generate correct summary when sender only have code', function() {
                draftMock.getAddressInfo.and.returnValue({ UserCode: 'TESTME', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('TESTME');
            });

            it('converts lowercase sender to uppercase', function() {
                draftMock.getAddressInfo.and.returnValue({ UserCode: 'testme', Duplicate: false });

                card = createCard();

                expect(cardServiceMock.widgetMocks[3].setContent).toHaveBeenCalledWith('TESTME');
            });

            it('handles if any of the values besides name are null', function() {
                draftMock.getAddressInfo.and.returnValue({ Name: 'Test Testersen', Address: null, Mail: null, ZipCode: null, City: null, Duplicate: false });

                expect(createCard).not.toThrow();
            });
        });

        it('multiline is enabled', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[3].setMultiline).toHaveBeenCalledWith(true);
        });

        it('icon is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[3].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.AddressInfo);
        });
    });

    describe('attachment keyvalue is added', function() {
        it('top label is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[4].setTopLabel).toHaveBeenCalledWith(Strings.Summary.AttachmentLabel);
        });

        it('content is correct', function() {
            draftMock.getAttachment.and.returnValue([{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }, { id: 'bbbbbbbbbbbbbbb', main: false, text: 'Vedleggtest' }]);

            card = createCard();

            expect(cardServiceMock.widgetMocks[4].setContent).toHaveBeenCalledWith("<i>Testvedlegg</i><br>Vedleggtest");
        });

        it('icon is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[4].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.Attachments);
        });
    });

    describe('import text button widget', function() {
        it('text is correct', function() {
            card = createCard();

            expect(cardServiceMock.widgetMocks[5].setText).toHaveBeenCalledWith(Strings.Summary.StartImportButtonText);
        });

        it('function name points to correct handler function', function() {
            card = createCard();

            expect(cardServiceMock.actionMocks[0].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
        });

        it('sets action origins parameters', function() {
            card = createCard();

            expect(cardServiceMock.actionMocks[0].setParameters).toHaveBeenCalledWith({ action: Actions.Summary.StartImport });
        });
    });
});