describe('JournalPostDraft', function() {
    var journalPostDraft;

    beforeEach(function() {
        journalPostDraft = JournalPostDraft();
    });

    it('is an object', function() {
        expect(typeof (journalPostDraft)).toBe('object');
    });

    it('setting and getting archiveid works fine', function() {
        var expectedId = "2018000001";

        journalPostDraft.setArchiveId(expectedId);

        expect(journalPostDraft.getArchiveId()).toBe(expectedId);
    });

    it('setting and getting journalpost title works fine', function() {
        var expectedTitle = "TestTitle";

        journalPostDraft.setJournalPostTitle(expectedTitle);

        expect(journalPostDraft.getJournalPostTitle()).toBe(expectedTitle);
    });

    it('setting and getting document type works fine', function() {
        var expectedType = "TestType";

        journalPostDraft.setDocumentType(expectedType);

        expect(journalPostDraft.getDocumentType()).toBe(expectedType);
    });

    it('setting and getting address info works fine', function() {
        var expected = { UserCode: "TEST" };

        journalPostDraft.setAddressInfo(expected);

        expect(journalPostDraft.getAddressInfo()).toBe(expected);
    });

    it('setting and getting attachment info works fine', function() {
        var expected = [{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }];

        journalPostDraft.setAttachment(expected);

        expect(journalPostDraft.getAttachment()).toBe(expected);
    });

    it('setting and getting handler info works fine', function() {
        var expected = 'USER1: Test, User [DEPARTMENT]';

        journalPostDraft.setHandler(expected);

        expect(journalPostDraft.getHandler()).toBe(expected);
    });

    it('initial attachment info is empty array', function() {
        expect(journalPostDraft.getAttachment()).toEqual([]);
    });

    it('set fields are stored in data object', function() {
        journalPostDraft.setArchiveId("2018000001");
        journalPostDraft.setJournalPostTitle("Some test title");
        journalPostDraft.setDocumentType("X");
        journalPostDraft.setAddressInfo({
            UserCode: "CODE",
            Fullname: "Full Name",
            Address: "Address 1",
            Mail: "mail@example.com",
            ZipCode: "0000",
            City: "Cityname"
        });
        journalPostDraft.setAttachment([{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }]);
        journalPostDraft.setHandler('USER1: Test, User [DEPARTMENT]');

        expect(journalPostDraft._getInternalDataObject()).toEqual({
            _archiveId: "2018000001",
            _journalPostTitle: "Some test title",
            _documentType: "X",
            _attachmentInfo: [{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }],
            _addressInfo: { UserCode: "CODE", Fullname: "Full Name", Address: "Address 1", Mail: "mail@example.com", ZipCode: "0000", City: "Cityname" },
            _handler: 'USER1: Test, User [DEPARTMENT]'
        });
    });
    
    it('when loading data object set fields are according to loaded values', function() {
        journalPostDraft._setInternalDataObject({
            _archiveId: "2018000001",
            _journalPostTitle: "Some test title",
            _documentType: "X",
            _attachmentInfo: [{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }],
            _addressInfo: { UserCode: "CODE", Fullname: "Full Name", Address: "Address 1", Mail: "mail@example.com", ZipCode: "0000", City: "Cityname" },
            _handler: 'USER1: Test, User [DEPARTMENT]'
        });

        expect(journalPostDraft.getArchiveId()).toEqual("2018000001");
        expect(journalPostDraft.getJournalPostTitle()).toEqual("Some test title");
        expect(journalPostDraft.getDocumentType()).toEqual("X");
        expect(journalPostDraft.getAddressInfo()).toEqual({ UserCode: "CODE", Fullname: "Full Name", Address: "Address 1", Mail: "mail@example.com", ZipCode: "0000", City: "Cityname" });
        expect(journalPostDraft.getAttachment()).toEqual([{ id: 'aaaaaaaaaaaaaaa', main: true, text: 'Testvedlegg' }]);
        expect(journalPostDraft.getHandler()).toEqual('USER1: Test, User [DEPARTMENT]');
    });
});