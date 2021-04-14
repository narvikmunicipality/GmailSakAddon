describe('MailAttachmentsService', function() {
    var service, authorizedUrlFetch;
    var TEST_MAIL_ID = "testMailId";
    var EXPECTED_RESULT = '[{"id":"68dbdf13b423ade4121dd9466ebc4362","text":"Mail attachment","isImportable":"true"},{"id":"1","text":"some_file.pdf","isImportable":"true"}]';

    beforeEach(function() {
        authorizedUrlFetch = jasmine.createSpyObj('AuthorizedUrlFetch', ['fetch']);
        authorizedUrlFetch.fetch.and.returnValue(EXPECTED_RESULT);

        service = MailAttachmentsService(authorizedUrlFetch, TEST_MAIL_ID);
    });

    it('retrieving list queries correct URL with mail id', function() {
        service.getAttachments();

        expect(authorizedUrlFetch.fetch).toHaveBeenCalledWith('https://example.com/prod/attachments/?mailId=testMailId');
    });

    it('returns retrieved list from server', function() {
        expect(service.getAttachments()).toEqual(JSON.parse(EXPECTED_RESULT));
    });
});