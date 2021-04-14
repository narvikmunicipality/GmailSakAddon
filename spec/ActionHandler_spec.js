describe('ActionHandler', function() {
    var originalActionHandlers, original_archiveIdService, original_addressInfoPrefillService, original_mailAttachmentsService, original_mailMetadataService, original_importService, original_authorizedUrlFetch, original_errorMessageCard, cacheMock;
    var original_addressInfoCodeService, original_chooseHandlerCodeService, original_websakCheckService, original_importLogService, original_lastUsedArchiveIdService;
    var TEST_MESSAGE_ID = "16156c7d6e456302", EXPECTED_ARCHIVEIDSERVICE = 'ArchiveIdService', EXPECTED_AUTHORIZEDURLFETCH = 'AuthorizedUrlFetch', EXPECTED_ADDRESSINFOCODESERVICE = 'AddressInfoCodeService', EXPECTED_ADDRESSINFOPREFILLSERVICE = 'AddressInfoPrefillService', TEST_ERRORMESSAGE_CARD = 'ErrorMessageCard';
    var EXPECTED_MAILATTACHMENTSSERVICE = 'MailAttachmentsService', EXPECTED_IMPORTSERVICE = 'ImportService', EXPECTED_WEBSAKCHECKSERVICE = 'WebsakCheckService', EXPECTED_CHOOSEHANDLERCODESERVICE = 'ChooseHandlerCodeService';
    var EXPECTED_IMPORTLOGSERVICE = 'ImportLogService', EXPECTED_LASTUSEDARCHIVEIDSERVICE = 'LastUsedArchiveIdService', EXPECTED_MAILMETADATASERVICE = 'MailMetadataService';
    var draftData = { _archiveId: '1', _journalPostTitle: 'Test tittel', _documentType: 'I', _attachmentInfo: [{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }], _addressInfo: { UserCode: 'TEST' } };
    var ActionEvent = { parameters: { action: 'ACTION' }, messageMetadata: { messageId: TEST_MESSAGE_ID } };

    beforeEach(function() {
        originalActionHandlers = ActionHandlers;
        original_archiveIdService = ArchiveIdService;
        original_authorizedUrlFetch = AuthorizedUrlFetch;
        original_addressInfoCodeService = AddressInfoCodeService;
        original_addressInfoPrefillService = AddressInfoPrefillService;
        original_mailAttachmentsService = MailAttachmentsService;
        original_chooseHandlerCodeService = ChooseHandlerCodeService;
        original_websakCheckService = WebsakCheckService;
        original_importService = ImportService;
        original_importLogService = ImportLogService;
        original_lastUsedArchiveIdService = LastUsedArchiveIdService;
        original_mailMetadataService = MailMetadataService;
        original_errorMessageCard = ErrorMessageCard;

        ArchiveIdService = jasmine.createSpy('ArchiveIdService');
        ArchiveIdService.and.returnValue(EXPECTED_ARCHIVEIDSERVICE);
        AddressInfoCodeService = jasmine.createSpy('AddressInfoCodeService');
        AddressInfoCodeService.and.returnValue(EXPECTED_ADDRESSINFOCODESERVICE);
        AddressInfoPrefillService = jasmine.createSpy('AddressInfoPrefillService');
        AddressInfoPrefillService.and.returnValue(EXPECTED_ADDRESSINFOPREFILLSERVICE);
        AuthorizedUrlFetch = jasmine.createSpy('AuthorizedUrlFetch');
        AuthorizedUrlFetch.and.returnValue(EXPECTED_AUTHORIZEDURLFETCH);
        MailAttachmentsService = jasmine.createSpy('MailAttachmentsService');
        MailAttachmentsService.and.returnValue(EXPECTED_MAILATTACHMENTSSERVICE);
        ImportService = jasmine.createSpy('ImportService');
        ImportService.and.returnValue(EXPECTED_IMPORTSERVICE);
        ImportLogService = jasmine.createSpy('ImportLogService');
        ImportLogService.and.returnValue(EXPECTED_IMPORTLOGSERVICE);
        LastUsedArchiveIdService = jasmine.createSpy('LastUsedArchiveIdService');
        LastUsedArchiveIdService.and.returnValue(EXPECTED_LASTUSEDARCHIVEIDSERVICE);
        ChooseHandlerCodeService = jasmine.createSpy('ChooseHandlerCodeService');
        ChooseHandlerCodeService.and.returnValue(EXPECTED_CHOOSEHANDLERCODESERVICE);
        WebsakCheckService = jasmine.createSpy('WebsakCheckService');
        WebsakCheckService.and.returnValue(EXPECTED_WEBSAKCHECKSERVICE);
        MailMetadataService = jasmine.createSpy('MailMetadataService');
        MailMetadataService.and.returnValue(EXPECTED_MAILMETADATASERVICE);
        ErrorMessageCard = jasmine.createSpy('ErrorMessageCard');
        ErrorMessageCard.and.returnValue(TEST_ERRORMESSAGE_CARD);
        Logger = jasmine.createSpyObj('Logger', ['log']);
        Utilities = jasmine.createSpyObj('Utilities', ['getUuid']);
        Utilities.getUuid.and.returnValue('UUID-VALUE');
        cacheMock = jasmine.createSpyObj('getUserCache', ['get', 'put']);
        CacheService = jasmine.createSpyObj('CacheServiceMock', ['getUserCache']);
        CacheService.getUserCache.and.returnValue(cacheMock);
        CardService = CardServiceHelper();
    });

    afterEach(function() {
        ActionHandlers = originalActionHandlers;
        ArchiveIdService = original_archiveIdService;
        AuthorizedUrlFetch = original_authorizedUrlFetch;
        AddressInfoCodeService = original_addressInfoCodeService;
        AddressInfoPrefillService = original_addressInfoPrefillService;
        MailAttachmentsService = original_mailAttachmentsService;
        ImportService = original_importService;
        ChooseHandlerCodeService = original_chooseHandlerCodeService;
        WebsakCheckService = original_websakCheckService;
        ImportLogService = original_importLogService;
        LastUsedArchiveIdService = original_lastUsedArchiveIdService;
        MailMetadataService = original_mailMetadataService;
        ErrorMessageCard = original_errorMessageCard;

        delete Logger;
        delete Utilities;
        delete CacheService;
    });

    it('ActionHandlers is not null', function() {
        expect(originalActionHandlers).not.toBeNull();
    });

    it('ActionHandler is an object', function() {
        expect(typeof (originalActionHandlers) === 'object').toBe(true);
    });

    describe('handler', function() {
        var ExpectedResult = "ActionHandlerResult";

        it('gets called with event object', function() {
            var actualEvent;
            ActionHandlers = { ACTION: function(event) { actualEvent = event; } };

            handleAction(ActionEvent);

            expect(actualEvent).toBe(ActionEvent);
        });

        it('returns ActionHandler value', function() {
            ActionHandlers = { ACTION: function(event) { return ExpectedResult; } };

            expect(handleAction(ActionEvent)).toBe(ExpectedResult);
        });

        describe('when handler throws exception', function() {
            function TestException(message) {
                this.message = message;
                this.stack = "STACKTRACE";
                this.toString = function() {  return "TestException: " + this.message; };
                return this;
            }

            beforeEach(function() {
                ActionHandlers = { ACTION: function(event, draft, services) { throw TestException('Test Failure'); } };
                spyOn(console, 'log');
            });

            describe('creates ErrorMessageCard with user friendly error message and logs technical error message', function() {
                it('creates newActionResponseBuilder with CardService', function() {
                    handleAction(ActionEvent);
            
                    expect(CardService.newActionResponseBuilder).toHaveBeenCalled();
                });
          
                it('created newActionResponseBuilder is built', function() {
                    handleAction(ActionEvent);
            
                    expect(CardService.newActionResponseBuilderMock.build).toHaveBeenCalled();
                });

                it('calls ErrorMessageCard with correct parameters', function() {
                    handleAction(ActionEvent);

                    expect(ErrorMessageCard).toHaveBeenCalledWith('Gmailsak - feil', 'Systemfeil', 'Det oppstod en intern feil i Gmailsak. Feilsøk-ID: UUID-VALUE');
                });

                it('navigation is created', function() {
                    handleAction(ActionEvent);

                    expect(CardService.newNavigation).toHaveBeenCalled();
                });                

                it('navigation is pushed with ErrorMessageCard', function() {
                    handleAction(ActionEvent);

                    expect(CardService.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_ERRORMESSAGE_CARD);
                });
                
                it('newActionResponseBuilder navigation is set to created navigation', function() {
                    handleAction(ActionEvent);
            
                    expect(CardService.newActionResponseBuilderMock.setNavigation).toHaveBeenCalledWith(CardService.newNavigationMock);
                });

                it('returns built newActionResponseBuilder', function() {
                    var errorCard = handleAction(ActionEvent);

                    expect(errorCard).toBe(CardService.newActionResponseBuilderMock);
                });

                it('logs error message with correct information', function() {
                    cacheMock.get.and.returnValue(JSON.stringify(draftData));

                    handleAction(ActionEvent);

                    expect(console.log).toHaveBeenCalledWith("ActionHandler fatal error (UUID-VALUE):\n\tError message: TestException: Test Failure\n\tEvent object: " + JSON.stringify(ActionEvent) + "\n\tJournalPostDraft object: " + JSON.stringify(draftData) + "\n\tStacktrace:\nSTACKTRACE");
                });
            });            
        });
    });

    it('AuthorizedUrlFetch is created', function() {
        ActionHandlers = { ACTION: function(event, draft, services) { } };

        handleAction(ActionEvent);

        expect(AuthorizedUrlFetch).toHaveBeenCalled();
    });

    describe('sets up services correctly', function() {
        describe('ArchiveIdService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.ArchiveId).toBe(EXPECTED_ARCHIVEIDSERVICE);
            });

            it('passes authorized url fetch to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(ArchiveIdService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH);
            });
        });

        describe('AddressInfoCodeService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.AddressInfoCode).toBe(EXPECTED_ADDRESSINFOCODESERVICE);
            });

            it('passes authorized url fetch to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(AddressInfoCodeService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH);
            });
        });

        describe('AddressInfoPrefillService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.AddressInfoPrefill).toBe(EXPECTED_ADDRESSINFOPREFILLSERVICE);
            });

            it('passes address info code to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(AddressInfoPrefillService).toHaveBeenCalledWith(EXPECTED_ADDRESSINFOCODESERVICE, jasmine.anything(), jasmine.anything());
            });

            it('passes handler journal post draft to service', function() {
                var expectedDraft;
                ActionHandlers = { ACTION: function(event, draft, services) { expectedDraft = draft; } };

                handleAction(ActionEvent);

                expect(AddressInfoPrefillService).toHaveBeenCalledWith(jasmine.anything(), expectedDraft, jasmine.anything());
            });

            it('passes message id to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(AddressInfoPrefillService).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), TEST_MESSAGE_ID);
            });
        });

        describe('MailAttachmentsService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.MailAttachments).toBe(EXPECTED_MAILATTACHMENTSSERVICE);
            });

            it('passes authorized url fetch and mail id to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(MailAttachmentsService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH, TEST_MESSAGE_ID);
            });
        });

        describe('ImportService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.Import).toBe(EXPECTED_IMPORTSERVICE);
            });

            it('passes authorized url fetch and mail id to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(ImportService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH, TEST_MESSAGE_ID);
            });
        });

        describe('ChooseHandlerCodeService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.ChooseHandlerCode).toBe(EXPECTED_CHOOSEHANDLERCODESERVICE);
            });

            it('passes authorized url fetch to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(ChooseHandlerCodeService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH);
            });
        });

        describe('WebsakCheckService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.WebsakCheck).toBe(EXPECTED_WEBSAKCHECKSERVICE);
            });

            it('passes authorized url fetch to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(WebsakCheckService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH);
            });
        });

        describe('ImportLogService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.ImportLog).toBe(EXPECTED_IMPORTLOGSERVICE);
            });

            it('passes AuthorizedUrlFetch and messageId to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(ImportLogService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH, TEST_MESSAGE_ID);
            });
        });

        describe('LastUsedArchiveIdService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.LastUsedArchiveId).toBe(EXPECTED_LASTUSEDARCHIVEIDSERVICE);
            });

            it('passes authorized url fetch to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(LastUsedArchiveIdService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH);
            });
        });

        describe('MailMetadataService', function() {
            it('puts service in services object to handler', function() {
                var actualServices;
                ActionHandlers = { ACTION: function(event, draft, services) { actualServices = services; } };

                handleAction(ActionEvent);

                expect(actualServices.MailMetadata).toBe(EXPECTED_MAILMETADATASERVICE);
            });

            it('passes AuthorizedUrlFetch and messageId to service', function() {
                ActionHandlers = { ACTION: function(event, draft, services) { } };

                handleAction(ActionEvent);

                expect(MailMetadataService).toHaveBeenCalledWith(EXPECTED_AUTHORIZEDURLFETCH, TEST_MESSAGE_ID);
            });
        });
    });

    describe('invalid handler', function() {
        it('if event does not contain valid action it throws error', function() {
            expect(function() { handleAction({ parameters: { action: 'INVALIDACTION' }, messageMetadata: { messageId: TEST_MESSAGE_ID } }); }).toThrow(new Error(Strings.ActionHandler.Invalid + "INVALIDACTION"));
        });

        it('if event does not contain action at all it throws error', function() {
            expect(function() { handleAction({ parameters: {}, messageMetadata: { messageId: TEST_MESSAGE_ID } }); }).toThrow(new Error(Strings.ActionHandler.NotSet));
        });
    });

    describe('loads journalpostdraft from CacheService', function() {
        it('gets stored journalpost data for current mail', function() {
            ActionHandlers = { ACTION: function(event, journalPostDraft) { actualDraft = journalPostDraft; } };

            handleAction(ActionEvent);

            expect(cacheMock.get).toHaveBeenCalledWith("16156c7d6e456302_JournalPostDraft");
        });

        it('value from CacheService is loaded in journalPostDraft to handler', function() {
            var actualDraft;
            ActionHandlers = { ACTION: function(event, journalPostDraft) { actualDraft = journalPostDraft; } };
            cacheMock.get.and.returnValue(JSON.stringify(draftData));

            handleAction(ActionEvent);

            expect(actualDraft._getInternalDataObject()).toEqual(draftData);
        });

        it('when value from CacheService is empty the default value in journalPostDraft is used', function() {
            var actualDraft;
            var unsetJournalPostDraft = JournalPostDraft();
            ActionHandlers = { ACTION: function(event, journalPostDraft) { actualDraft = journalPostDraft; } };
            cacheMock.get.and.returnValue(null);

            handleAction(ActionEvent);

            expect(actualDraft._getInternalDataObject()).toEqual(unsetJournalPostDraft._getInternalDataObject());
        });

        it('stores modified journalPostDraft in CacheService', function() {
            var expectedData = Object.assign({}, draftData);
            expectedData._archiveId = '2018000001';
            ActionHandlers = { ACTION: function(event, journalPostDraft) { journalPostDraft.setArchiveId('2018000001'); } };
            cacheMock.get.and.returnValue(JSON.stringify(draftData));

            handleAction(ActionEvent);

            expect(cacheMock.put).toHaveBeenCalledWith("16156c7d6e456302_JournalPostDraft", JSON.stringify(expectedData), jasmine.anything());
        });

        it('stores journalPostDraft for 1 hour in CacheService', function() {
            ActionHandlers = { ACTION: function(event, journalPostDraft) { } };
            cacheMock.get.and.returnValue(JSON.stringify(draftData));

            handleAction(ActionEvent);
            expect(cacheMock.put).toHaveBeenCalledWith("16156c7d6e456302_JournalPostDraft", jasmine.anything(), 3600);
        });
    });
});