describe('ImportService', function() {
    var service, authorizedUrlFetchMock, httpResponseMock, draft;
    var TEST_MAIL_ID = 'testmailid';
    var TEST_JOURNALPOSTDRAFT_INTERNAL_OBJECT_WITH_CODE = {
        _archiveId: { archiveid: "2018000001", archivetitel: "Testsaktittel" },
        _journalPostTitle: "Some test title",
        _documentType: "X",
        _attachmentInfo: [{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }, { id: '123456', main: false, text: 'Testvedlegg' }],
        _addressInfo: { UserCode: "CODE", Name: "Full Name", Address: "Address 1", Mail: "mail@example.com", ZipCode: "0000", City: "Cityname" },
    };
    var TEST_JOURNALPOSTDRAFT_INTERNAL_OBJECT_WITHOUT_CODE = {
        _archiveId: { archiveid: "2018000001", archivetitel: "Testsaktittel" },
        _journalPostTitle: "Some test title",
        _documentType: "X",
        _attachmentInfo: [{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }, { id: '123456', main: false, text: 'Testvedlegg' }],
        _addressInfo: { Name: "Full Name", Address: "Address 1", Mail: "mail@example.com", ZipCode: "0000", City: "Cityname" },
    };

    var TEST_JOURNALPOSTDRAFT_INTERNAL_OBJECT_WITH_HANDLER = {
        _archiveId: { archiveid: "2018000001", archivetitel: "Testsaktittel" },
        _journalPostTitle: "Some test title",
        _documentType: "X",
        _attachmentInfo: [{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }, { id: '123456', main: false, text: 'Testvedlegg' }],
        _addressInfo: { UserCode: "CODE", Name: "Full Name", Address: "Address 1", Mail: "mail@example.com", ZipCode: "0000", City: "Cityname" },
        _handler: 'HANDLER: Handler, User [DEPARTMENT]'
    };

    var TEST_CONVERTED_DRAFT_WITH_CODE = {
        mailId: TEST_MAIL_ID,
        archiveId: "2018000001",
        title: "Some test title",
        documentType: "X",
        attachments: [{ attachmentId: 'aaaaaaaaaaaaaaa', mainDocument: true }, { attachmentId: '123456', mainDocument: false }],
        senderCode: "CODE"
    };

    var TEST_CONVERTED_DRAFT_WITH_HANDLER = {
        mailId: TEST_MAIL_ID,
        archiveId: "2018000001",
        title: "Some test title",
        documentType: "X",
        attachments: [{ attachmentId: 'aaaaaaaaaaaaaaa', mainDocument: true }, { attachmentId: '123456', mainDocument: false }],
        senderCode: "CODE",
        handler: 'HANDLER'
    };

    var TEST_CONVERTED_DRAFT_WITHOUT_CODE = {
        mailId: TEST_MAIL_ID,
        archiveId: "2018000001",
        title: "Some test title",
        documentType: "X",
        attachments: [{ attachmentId: 'aaaaaaaaaaaaaaa', mainDocument: true }, { attachmentId: '123456', mainDocument: false }],
        senderName: 'Full Name',
        senderAddress: 'Address 1',
        senderMail: 'mail@example.com',
        senderZipCode: '0000',
        senderCity: 'Cityname'
    };

    beforeEach(function() {
        draft = JournalPostDraft();
        draft._setInternalDataObject(TEST_JOURNALPOSTDRAFT_INTERNAL_OBJECT_WITH_CODE);
        httpResponseMock = jasmine.createSpyObj('HTTPResponse', ['getResponseCode', 'getContentText']);
        httpResponseMock.getResponseCode.and.returnValue("200");
        httpResponseMock.getContentText.and.returnValue('{ "status": "jp.id", "message": "2018000001" }');
        authorizedUrlFetchMock = jasmine.createSpyObj('AuthorizedUrlFetch', ['fetch']);
        authorizedUrlFetchMock.fetch.and.returnValue(httpResponseMock);
        Utilities = jasmine.createSpyObj('Utilities', ['getUuid']);
        spyOn(console, 'log');

        service = ImportService(authorizedUrlFetchMock, TEST_MAIL_ID);
    });

    afterEach(function() {
        delete Utilities;
    });

    it('import uses correct URL', function() {
        service.import(draft);

        expect(authorizedUrlFetchMock.fetch).toHaveBeenCalledWith('https://example.com/prod/import', jasmine.anything());
    });

    it('converts given draft as payload to service correctly when it contains sender code', function() {
        service.import(draft);

        expect(authorizedUrlFetchMock.fetch).toHaveBeenCalledWith(jasmine.anything(), TEST_CONVERTED_DRAFT_WITH_CODE);
    });

    it('converts given draft as payload to service correctly when it only contains address information', function() {
        draft._setInternalDataObject(TEST_JOURNALPOSTDRAFT_INTERNAL_OBJECT_WITHOUT_CODE);

        service.import(draft);

        expect(authorizedUrlFetchMock.fetch).toHaveBeenCalledWith(jasmine.anything(), TEST_CONVERTED_DRAFT_WITHOUT_CODE);
    });

    it('converts given draft as payload to service correctly when it contains handler', function() {
        draft._setInternalDataObject(TEST_JOURNALPOSTDRAFT_INTERNAL_OBJECT_WITH_HANDLER);

        service.import(draft);

        expect(authorizedUrlFetchMock.fetch).toHaveBeenCalledWith(jasmine.anything(), TEST_CONVERTED_DRAFT_WITH_HANDLER);
    });

    it('returns result from service', function() {
        var expectedResult = { status: "jp.id", message: "2018000001" };
        var result = service.import(draft);

        expect(result).toEqual(expectedResult);
    });

    it('if response code is not 200 it returns error message', function() {        
        var expectedResult = { "status": "ERROR", "message": "Det har oppstått en teknisk feil! Diagnose-ID: DIAGNOSEID" };
        Utilities.getUuid.and.returnValue("DIAGNOSEID");        
        httpResponseMock.getResponseCode.and.returnValue("500");
        authorizedUrlFetchMock.fetch.and.returnValue(httpResponseMock);

        var result = service.import(draft);

        expect(result).toEqual(expectedResult);
    });

    it('if response code is not 200 it returns error message', function() {        
        var expectedResult = "ImportService import result (DIAGNOSEID): test error message";
        Utilities.getUuid.and.returnValue("DIAGNOSEID");        
        httpResponseMock.getResponseCode.and.returnValue("500");
        httpResponseMock.getContentText.and.returnValue("test error message");
        authorizedUrlFetchMock.fetch.and.returnValue(httpResponseMock);

        service.import(draft);

        expect(console.log).toHaveBeenCalledWith(expectedResult);
    });
});