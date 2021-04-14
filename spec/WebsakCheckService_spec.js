describe('WebsakCheckService', function() {
    var service, authorizedUrlFetchMock;

    beforeEach(function() {
        authorizedUrlFetchMock = jasmine.createSpyObj('AuthorizedUrlFetch', ['fetch']);
        authorizedUrlFetchMock.fetch.and.returnValue('{"valid":true,"chooseHandler":true}');

        service = WebsakCheckService(authorizedUrlFetchMock);
    });

    it('queries correct url', function() {
        service.getUserStatus();

        expect(authorizedUrlFetchMock.fetch).toHaveBeenCalledWith('https://example.com/prod/websakcheck');
    });

    it('returns result from service', function() {
        expect(service.getUserStatus()).toEqual({ "valid": true, "chooseHandler": true });
    });
});