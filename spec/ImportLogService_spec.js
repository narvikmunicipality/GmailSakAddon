describe('ImportLogService', function() {
    var service, authorizedUrlFetchMock;
    var TEST_MAIL_ID = "testMailId";

    beforeEach(function() {
        authorizedUrlFetchMock = jasmine.createSpyObj('AuthorizedUrlFetch', ['fetch']);
        authorizedUrlFetchMock.fetch.and.returnValue('{ "imported": "2018000001" }');

        service = ImportLogService(authorizedUrlFetchMock, TEST_MAIL_ID);
    });

    it('queries correct url', function() {
        service.getLastId();

        expect(authorizedUrlFetchMock.fetch).toHaveBeenCalledWith('https://example.com/prod/importlog?mailId=testMailId');
    });

    it('returns id in result from service', function() {
        expect(service.getLastId()).toEqual("2018000001");
    });
});