describe('AddressInfoCard', function() {
    var card, cardServiceMock, draftMock, addressInfoPrefillMock;
    var TEST_ACTIVE_MAIL_ADDRESS = "active_user@example.com";
    var TEST_RECEIVER_MAIL_ADDRESS = "receiver@example.com";
    var TEST_INNGAENDE_DOCUMENT_TYPE = "I";
    var TEST_UTGAENDE_DOCUMENT_TYPE = "U";
    var TEST_MESSAGE_ID = "16156c7d6e456302";
    var TEST_USER_CODE = "TEST_CODE", TEST_FULL_NAME = "TEST FULL NAME", TEST_EMAIL_ADDRESS = "TEST EMAIL ADDRESS";
    
    var INDEX_FULLNAME_INPUT = 0;
    var INDEX_ADRESS_INPUT = 1;
    var INDEX_MAIL_INPUT = 2;
    var INDEX_ZIP_CODE_INPUT = 3;
    var INDEX_CITY_INPUT = 4;
    var INDEX_APPLY_BUTTON_1 = 5;
    var INDEX_USER_CODE_ID_INPUT = 6;
    var INDEX_APPLY_BUTTON_2 = 7;
    var INDEX_TIPS_AND_TRICKS_LABEL = 8;

    beforeEach(function() {
        draftMock = jasmine.createSpyObj("JournalPostDraft", ['getDocumentType']);

        sessionMock = SessionHelper();
        sessionMock.getActiveUser.and.returnValue({ getEmail: function() { return TEST_ACTIVE_MAIL_ADDRESS; } });

        gmailAppMock = GmailAppHelper();
        gmailAppMock.getMessageById.and.returnValue({ getTo: function() { return TEST_RECEIVER_MAIL_ADDRESS; } });

        addressInfoPrefillMock = jasmine.createSpyObj('AddressInfoPrefillService', ['getEmailAddress', 'getUserCode', 'getFullname']);

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
        GmailApp = gmailAppMock;
        Session = sessionMock;
    });

    function createCard() {
        return AddressInfoCard(TEST_MESSAGE_ID, draftMock, addressInfoPrefillMock);
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

        it('sets correct header title when document type is inngående', function() {
            draftMock.getDocumentType.and.returnValue(TEST_INNGAENDE_DOCUMENT_TYPE);

            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.AddressInfo.CardTitleReceiver);
        });

        it('sets correct header title when document type is utgående', function() {
            draftMock.getDocumentType.and.returnValue(TEST_UTGAENDE_DOCUMENT_TYPE);

            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setTitle).toHaveBeenCalledWith(Strings.AddressInfo.CardTitleSender);
        });

        it('sets correct header image url', function() {
            card = createCard();

            expect(cardServiceMock.newCardHeaderMock.setImageUrl).toHaveBeenCalledWith(GmailsakIcon.AddressInfo);
        });
    });

    describe('user code section is added correctly', function() {
        it('section header text is set correctly', function() {
            card = createCard();

            expect(cardServiceMock.sectionMocks[1].setHeader).toHaveBeenCalledWith(Strings.AddressInfo.CardHeaderTitleUserCode);
        });

        it('section is added to card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[1]);
        });

        describe('user code widget', function() {
            it('field name is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_USER_CODE_ID_INPUT].setFieldName).toHaveBeenCalledWith(Fields.AddressInfo.UserCodeId);
            });

            it('title is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_USER_CODE_ID_INPUT].setTitle).toHaveBeenCalledWith(Strings.AddressInfo.UserCodeTextTitle);
            });

            it('suggestions action is correct', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[1].setFunctionName).toHaveBeenCalledWith(System.AddressInfoCodeSuggestionsFunction);
            });

            it('suggestions action is set on textinput', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_USER_CODE_ID_INPUT].setSuggestionsAction).toHaveBeenCalledWith(cardServiceMock.actionMocks[1]);
            });

            it('sets prefilled code value as default', function() {
                addressInfoPrefillMock.getUserCode.and.returnValue(TEST_USER_CODE);

                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_USER_CODE_ID_INPUT].setValue).toHaveBeenCalledWith(TEST_USER_CODE);
            });
        });

        describe('text button widget', function() {
            it('text is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_APPLY_BUTTON_2].setText).toHaveBeenCalledWith(Strings.AddressInfo.SetAddressInfoButtonText);
            });

            it('function name points to correct handler function', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[2].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
            });

            it('sets action origins parameters', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[2].setParameters).toHaveBeenCalledWith({ action: Actions.AddressInfo.SetUserCode });
            });
        });
    });

    describe('address information section is added correctly', function() {
        it('section header text is set correctly', function() {
            card = createCard();

            expect(cardServiceMock.sectionMocks[0].setHeader).toHaveBeenCalledWith(Strings.AddressInfo.CardHeaderTitleAddress);
        });

        it('section is added to card', function() {
            card = createCard();

            expect(cardServiceMock.newCardBuilderMock.addSection).toHaveBeenCalledWith(cardServiceMock.sectionMocks[0]);
        });

        describe('full name widget', function() {
            it('field name is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_FULLNAME_INPUT].setFieldName).toHaveBeenCalledWith(Fields.AddressInfo.FullnameId);
            });

            it('title is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_FULLNAME_INPUT].setTitle).toHaveBeenCalledWith(Strings.AddressInfo.FullnameTextTitle);
            });

            it('value is set to prefill value', function() {
                addressInfoPrefillMock.getFullname.and.returnValue(TEST_FULL_NAME);

                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_FULLNAME_INPUT].setValue).toHaveBeenCalledWith(TEST_FULL_NAME);
            });
        });

        describe('address widget', function() {
            it('field name is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_ADRESS_INPUT].setFieldName).toHaveBeenCalledWith(Fields.AddressInfo.AddressId);
            });

            it('title is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_ADRESS_INPUT].setTitle).toHaveBeenCalledWith(Strings.AddressInfo.AddressTextTitle);
            });
        });

        describe('mail widget', function() {
            it('field name is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_MAIL_INPUT].setFieldName).toHaveBeenCalledWith(Fields.AddressInfo.MailId);
            });

            it('title is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_MAIL_INPUT].setTitle).toHaveBeenCalledWith(Strings.AddressInfo.MailTextTitle);
            });

            it('value is set to prefill value', function() {
                addressInfoPrefillMock.getEmailAddress.and.returnValue(TEST_EMAIL_ADDRESS);

                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_MAIL_INPUT].setValue).toHaveBeenCalledWith(TEST_EMAIL_ADDRESS);
            });
        });

        describe('zip code widget', function() {
            it('field name is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_ZIP_CODE_INPUT].setFieldName).toHaveBeenCalledWith(Fields.AddressInfo.ZipCodeId);
            });

            it('title is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_ZIP_CODE_INPUT].setTitle).toHaveBeenCalledWith(Strings.AddressInfo.ZipCodeTextTitle);
            });
        });

        describe('city widget', function() {
            it('field name is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_CITY_INPUT].setFieldName).toHaveBeenCalledWith(Fields.AddressInfo.CityId);
            });

            it('title is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_CITY_INPUT].setTitle).toHaveBeenCalledWith(Strings.AddressInfo.CityTextTitle);
            });
        });

        describe('text button widget', function() {
            it('text is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_APPLY_BUTTON_1].setText).toHaveBeenCalledWith(Strings.AddressInfo.SetAddressInfoButtonText);
            });

            it('function name points to correct handler function', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[0].setFunctionName).toHaveBeenCalledWith(System.ActionHandlerFunction);
            });

            it('sets action origins parameters', function() {
                card = createCard();

                expect(cardServiceMock.actionMocks[0].setParameters).toHaveBeenCalledWith({ action: Actions.AddressInfo.SetAddressInfo });
            });
        });

        describe('adds code tips', function() {
            it('label value is correct', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_TIPS_AND_TRICKS_LABEL].setTopLabel).toHaveBeenCalledWith(Strings.Common.TipsAndTricks);
            });

            it('content is set to tips text', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_TIPS_AND_TRICKS_LABEL].setContent).toHaveBeenCalledWith(Strings.AddressInfo.DuplicateCodeTips);
            });

            it('turns on multiline text', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_TIPS_AND_TRICKS_LABEL].setMultiline).toHaveBeenCalledWith(true);
            });

            it('set icon address to tips and tricks icon URL', function() {
                card = createCard();

                expect(cardServiceMock.widgetMocks[INDEX_TIPS_AND_TRICKS_LABEL].setIconUrl).toHaveBeenCalledWith(GmailsakIcon.TipsAndTricks);
            });
        });
    });
});