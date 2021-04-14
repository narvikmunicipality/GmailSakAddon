describe('LastUsedArchiveIdService', function() {
    var service, authorizedUrlFetch;
    var EXPECTED_RESULT = '{"archiveid":"2018000001","archivetitle":"Testsak"}';

    beforeEach(function() {
        authorizedUrlFetch = jasmine.createSpyObj('AuthorizedUrlFetch', ['fetch']);
        authorizedUrlFetch.fetch.and.returnValue(EXPECTED_RESULT);

        service = LastUsedArchiveIdService(authorizedUrlFetch);
    });

    it('retrieving list queries correct URL with mail id', function() {
        service.getArchiveId();

        expect(authorizedUrlFetch.fetch).toHaveBeenCalledWith('https://example.com/prod/lastarchiveid');
    });

    it('returns retrieved list from server', function() {
        expect(service.getArchiveId()).toEqual(JSON.parse(EXPECTED_RESULT));
    });
});