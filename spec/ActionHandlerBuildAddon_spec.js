describe('ActionHandlerBuildAddon', function() {
    var handler = ActionHandlers[Actions.BuildAddon.BuildAddon], eventData, draftMock, services, lastUsedArchiveIdServiceMock, importLogServiceMock, mailMetadataServiceMock, sessionMock, websakCheckServiceMock;
    var TEST_ARCHIVECARD = 'ArchiveCard', TEST_ALREADYIMPORTEDID = 'importedJournalPostId', TEST_LASTUSEDARCHIVEID = 'lastUsedArchiveId', TEST_OWNER_MAIL = "owner@example.com", TEST_USERCHECKERRORCARD = 'UserCheckErrorCard';
    var original_archiveCard, original_userCheckErrorCard;

    beforeEach(function() {
        original_archiveCard = ArchiveCard;
        original_userCheckErrorCard = UserCheckErrorCard;
        ArchiveCard = jasmine.createSpy('ArchiveCard');
        ArchiveCard.and.returnValue(TEST_ARCHIVECARD);
        UserCheckErrorCard = jasmine.createSpy('UserCheckErrorCard');
        UserCheckErrorCard.and.returnValue(TEST_USERCHECKERRORCARD);
        lastUsedArchiveIdServiceMock = jasmine.createSpyObj('LastUsedArchiveIdService', ['getArchiveId']);
        lastUsedArchiveIdServiceMock.getArchiveId.and.returnValue(TEST_LASTUSEDARCHIVEID);
        importLogServiceMock = jasmine.createSpyObj('ImportLogService', ['getLastId']);
        importLogServiceMock.getLastId.and.returnValue(TEST_ALREADYIMPORTEDID);
        websakCheckServiceMock = jasmine.createSpyObj('WebsakCheck', ['getUserStatus']);
        websakCheckServiceMock.getUserStatus.and.returnValue({ valid: true });
        sessionMock = jasmine.createSpyObj('Session', ['getEmail']);
        sessionMock.getEmail.and.returnValue(TEST_OWNER_MAIL);
        Session = SessionHelper();
        Session.getActiveUser.and.returnValue(sessionMock);

        eventData = {};
        services = {
            ImportLog: importLogServiceMock,
            LastUsedArchiveId: lastUsedArchiveIdServiceMock,
            MailMetadata: mailMetadataServiceMock,
            WebsakCheck: websakCheckServiceMock
        };

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        ArchiveCard = original_archiveCard;
        UserCheckErrorCard = original_userCheckErrorCard;
        delete Session;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.BuildAddon.BuildAddon]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.BuildAddon.BuildAddon])).toBe("function");
    });

    it('returns array with ArchiveCard', function() {
        expect(handler(eventData, draftMock, services)).toEqual([TEST_ARCHIVECARD]);
    });

    it('passes last used archive id and imported journalpost id to ArchiveCard', function() {
        handler(eventData, draftMock, services);

        expect(ArchiveCard).toHaveBeenCalledWith(TEST_LASTUSEDARCHIVEID, TEST_ALREADYIMPORTEDID);
    });

    describe('User is not valid in check service', function() {
        beforeEach(function() {
            websakCheckServiceMock.getUserStatus.and.returnValue({ valid: false });
        });

        it('creates UserCheckErrorCard', function() {
            handler(eventData, draftMock, services);

            expect(UserCheckErrorCard).toHaveBeenCalled();
        });

        it('returns array with UserCheckErrorCard', function() {
            expect(handler(eventData, draftMock, services)).toEqual([TEST_USERCHECKERRORCARD]);
        });
    });
});
