describe('AddressInfoPrefillService', function() {
    var TEST_USERCODE = 'TEST_CODE: Test, User', TEST_MESSAGE_ID = 'expectedMessageId', TEST_FROM_ADDRESS = 'from@example.com', TEST_TO_ADDRESS = 'to@example.com', TEST_OWNER_ADDRESS = 'owner@example.com', TEST_FROM_NAME = 'From User', TEST_TO_NAME = 'To User';
    var TEST_FROM_ADDRESS_WITH_NAME_1 = 'From User <from@example.com>', TEST_TO_ADDRESS_WITH_NAME_1 = 'To User <to@example.com>', TEST_OWNER_ADDRESS_WITH_NAME_1 = '"Owner User" <owner@example.com>';
    var TEST_FROM_ADDRESS_WITH_NAME_2 = '"From User" <from@example.com>', TEST_TO_ADDRESS_WITH_NAME_2 = '"To User" <to@example.com>', TEST_OWNER_ADDRESS_WITH_NAME_2 = 'Owner User <owner@example.com>';
    var TEST_FROM_ADDRESS_ONLY_ANGLE_BRACKETS = '<from@example.com>', TEST_FROM_ADDRESS_ONLY_ANGLE_BRACKETS_LEADING_SPACE = ' <from@example.com>';
    var service, messageMock, addressInfoCodeServiceMock, draftMock, activeUserMock;

    beforeEach(function() {
        draftMock = jasmine.createSpyObj('JournalPostDraft', ['getDocumentType']);
        messageMock = jasmine.createSpyObj('GmailMessage', ['getFrom', 'getTo']);
        messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS);
        messageMock.getTo.and.returnValue(TEST_TO_ADDRESS);
        GmailApp = GmailAppHelper();
        GmailApp.getMessageById.and.returnValue(messageMock);
        addressInfoCodeServiceMock = jasmine.createSpyObj('AddressInfoCodeService', ['getSuggestion']);
        addressInfoCodeServiceMock.getSuggestion.and.returnValue(TEST_USERCODE);
        activeUserMock = jasmine.createSpyObj('getActiveUser', ['getEmail']);
        activeUserMock.getEmail.and.returnValue(TEST_OWNER_ADDRESS);
        Session = jasmine.createSpyObj('Session', ['getActiveUser']);
        Session.getActiveUser.and.returnValue(activeUserMock);

        service = AddressInfoPrefillService(addressInfoCodeServiceMock, draftMock, TEST_MESSAGE_ID);
    });

    afterEach(function() {
        delete GmailApp;
        delete Session;
    });

    describe('getUserCode', function() {
        describe('when document type is inngående', function() {
            beforeEach(function() {
                draftMock.getDocumentType.and.returnValue('I');
            });

            it('returns code from service', function() {
                expect(service.getUserCode()).toEqual(TEST_USERCODE);
            });

            it('uses from address to search with service', function() {
                service.getUserCode();

                expect(addressInfoCodeServiceMock.getSuggestion).toHaveBeenCalledWith(TEST_FROM_ADDRESS);
            });

            it('uses from address without name to search with service', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_WITH_NAME_1);

                service.getUserCode();

                expect(addressInfoCodeServiceMock.getSuggestion).toHaveBeenCalledWith(TEST_FROM_ADDRESS);
            });

            it('uses from address without name in quotation marks to search with service', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_WITH_NAME_2);

                service.getUserCode();

                expect(addressInfoCodeServiceMock.getSuggestion).toHaveBeenCalledWith(TEST_FROM_ADDRESS);
            });

            it('uses from address without angle brackets to search with service', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_ONLY_ANGLE_BRACKETS);
                service.getUserCode();

                expect(addressInfoCodeServiceMock.getSuggestion).toHaveBeenCalledWith(TEST_FROM_ADDRESS);
            });

            it('uses from address without leading space and angle brackets to search with service', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_ONLY_ANGLE_BRACKETS_LEADING_SPACE);
                service.getUserCode();

                expect(addressInfoCodeServiceMock.getSuggestion).toHaveBeenCalledWith(TEST_FROM_ADDRESS);
            });

            it('uses provided messageId when doing lookup with GmailApp', function() {
                service.getUserCode();

                expect(GmailApp.getMessageById).toHaveBeenCalledWith(TEST_MESSAGE_ID);
            });

            it('returns empty user code when from address is same as owner address', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS);

                expect(service.getUserCode()).toEqual('');
            });

            it('returns empty user code when from address is same as owner address with name', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_1);

                expect(service.getUserCode()).toEqual('');
            });

            it('returns empty user code when from address is same as owner address with name in quotation marks', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_2);

                expect(service.getUserCode()).toEqual('');
            });
        });

        describe('when document type is utgående', function() {
            beforeEach(function() {
                draftMock.getDocumentType.and.returnValue('U');
            });

            it('returns code from service', function() {
                expect(service.getUserCode()).toEqual(TEST_USERCODE);
            });

            it('uses to address to search with service', function() {
                service.getUserCode();

                expect(addressInfoCodeServiceMock.getSuggestion).toHaveBeenCalledWith(TEST_TO_ADDRESS);
            });

            it('uses to address with name to search with service', function() {
                messageMock.getTo.and.returnValue(TEST_TO_ADDRESS_WITH_NAME_1);

                service.getUserCode();

                expect(addressInfoCodeServiceMock.getSuggestion).toHaveBeenCalledWith(TEST_TO_ADDRESS);
            });

            it('uses to address with name in quotation marks to search with service', function() {
                messageMock.getTo.and.returnValue(TEST_TO_ADDRESS_WITH_NAME_2);

                service.getUserCode();

                expect(addressInfoCodeServiceMock.getSuggestion).toHaveBeenCalledWith(TEST_TO_ADDRESS);
            });

            it('when to field contains multiple addresses it returns empty user code', function() {
                messageMock.getTo.and.returnValue('to1@example.com,to2@example.com')

                expect(service.getUserCode()).toEqual('');
            });

            it('uses provided messageId when doing lookup with GmailApp', function() {
                service.getUserCode();

                expect(GmailApp.getMessageById).toHaveBeenCalledWith(TEST_MESSAGE_ID);
            });

            it('returns empty user code when to address is same as owner address', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS);

                expect(service.getUserCode()).toEqual('');
            });

            it('returns empty user code when to address is same as owner address with name', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_1);

                expect(service.getUserCode()).toEqual('');
            });

            it('returns empty user code when to address is same as owner address with name in quotation marks', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_2);

                expect(service.getUserCode()).toEqual('');
            });
        });
    });

    describe('getEmailAddress', function() {
        describe('when document type is inngående', function() {
            beforeEach(function() {
                draftMock.getDocumentType.and.returnValue('I');
            });

            it('returns from address', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS);

                expect(service.getEmailAddress()).toEqual(TEST_FROM_ADDRESS);
            });

            it('returns from address with name', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_WITH_NAME_1);

                expect(service.getEmailAddress()).toEqual(TEST_FROM_ADDRESS);
            });

            it('returns from address with name in quotation marks', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_WITH_NAME_2);

                expect(service.getEmailAddress()).toEqual(TEST_FROM_ADDRESS);
            });

            it('returns from address with only mail in angle brackets', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_ONLY_ANGLE_BRACKETS);

                expect(service.getEmailAddress()).toEqual(TEST_FROM_ADDRESS);
            });            

            it('returns empty string when from address is equal to owner address', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS);

                expect(service.getEmailAddress()).toEqual('');
            });

            it('returns empty string when from address is equal to owner address with name', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_1);

                expect(service.getEmailAddress()).toEqual('');
            });

            it('returns empty string when from address is equal to owner address with name in quotation marks', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_2);

                expect(service.getEmailAddress()).toEqual('');
            });
        });

        describe('when document type is utgående', function() {
            beforeEach(function() {
                draftMock.getDocumentType.and.returnValue('U');
            });

            it('returns to address', function() {
                messageMock.getTo.and.returnValue(TEST_TO_ADDRESS);

                expect(service.getEmailAddress()).toEqual(TEST_TO_ADDRESS);
            });

            it('returns to address with name', function() {
                messageMock.getTo.and.returnValue(TEST_TO_ADDRESS_WITH_NAME_1);

                expect(service.getEmailAddress()).toEqual(TEST_TO_ADDRESS);
            });

            it('returns to address with name in quotation marks', function() {
                messageMock.getTo.and.returnValue(TEST_TO_ADDRESS_WITH_NAME_2);

                expect(service.getEmailAddress()).toEqual(TEST_TO_ADDRESS);
            });

            it('returns emptry string when to address is equal to owner address', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS);

                expect(service.getEmailAddress()).toEqual('');
            });

            it('returns emptry string when to address is equal to owner address with name', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_1);

                expect(service.getEmailAddress()).toEqual('');
            });

            it('returns emptry string when to address is equal to owner address with name in quotation marks', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_2);

                expect(service.getEmailAddress()).toEqual('');
            });

            it('returns emptry string when to address contains multiple addresses', function() {
                messageMock.getTo.and.returnValue('to1@example.com,to2@example.com');

                expect(service.getEmailAddress()).toEqual('');
            });
        });
    });

    describe('getFullname', function() {
        describe('when document type is inngående', function() {
            beforeEach(function() {
                draftMock.getDocumentType.and.returnValue('I');
            });

            it('return empty string when from address does not contain name', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS);

                expect(service.getFullname()).toEqual('');
            });

            it('returns name in from address with name', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_WITH_NAME_1);

                expect(service.getFullname()).toEqual(TEST_FROM_NAME);
            });

            it('returns name in from address with name in quotation marks', function() {
                messageMock.getFrom.and.returnValue(TEST_FROM_ADDRESS_WITH_NAME_2);

                expect(service.getFullname()).toEqual(TEST_FROM_NAME);
            });

            it('returns empty string when from address is equal to owner address', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS);

                expect(service.getFullname()).toEqual('');
            });

            it('returns empty string when from address is equal to owner address with name', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_1);

                expect(service.getFullname()).toEqual('');
            });

            it('returns empty string when from address is equal to owner address with name in quotation marks', function() {
                messageMock.getFrom.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_2);

                expect(service.getFullname()).toEqual('');
            });
        });

        describe('when document type is utgående', function() {
            beforeEach(function() {
                draftMock.getDocumentType.and.returnValue('U');
            });

            it('return empty string when to address does not contain name', function() {
                messageMock.getTo.and.returnValue(TEST_TO_ADDRESS);

                expect(service.getFullname()).toEqual('');
            });

            it('returns name in to address with name', function() {
                messageMock.getTo.and.returnValue(TEST_TO_ADDRESS_WITH_NAME_1);

                expect(service.getFullname()).toEqual(TEST_TO_NAME);
            });

            it('returns name in to address with name in quotation marks', function() {
                messageMock.getTo.and.returnValue(TEST_TO_ADDRESS_WITH_NAME_2);

                expect(service.getFullname()).toEqual(TEST_TO_NAME);
            });

            it('returns emptry string when to address is equal to owner address', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS);

                expect(service.getFullname()).toEqual('');
            });

            it('returns emptry string when to address is equal to owner address with name', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_1);

                expect(service.getFullname()).toEqual('');
            });

            it('returns emptry string when to address is equal to owner address with name in quotation marks', function() {
                messageMock.getTo.and.returnValue(TEST_OWNER_ADDRESS_WITH_NAME_2);

                expect(service.getFullname()).toEqual('');
            });

            it('returns emptry string when to address contains multiple addresses', function() {
                messageMock.getTo.and.returnValue('to1@example.com,to2@example.com');

                expect(service.getFullname()).toEqual('');
            });
        });
    });
});