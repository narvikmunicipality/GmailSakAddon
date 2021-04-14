describe('AuthorizedUrlFetch', function() {
    var urlFetch;
    var TEST_URL = 'https://example.com/';
    var OK_RESPONSE = { getResponseCode: () => 200 };
    var OAUTH_TOKEN = 'TEST_OAUTH_TOKEN';

    beforeEach(function() {
        UrlFetchApp = jasmine.createSpyObj('UrlFetchApp', ['fetch']);
        ScriptApp = jasmine.createSpyObj('ScriptApp', ['getOAuthToken']);
        ScriptApp.getOAuthToken.and.returnValue(OAUTH_TOKEN);
        urlFetch = AuthorizedUrlFetch();
        
    });
    
    afterEach(function() {
        delete UrlFetchApp;
    });
    
    it('uses given in url in UrlFetchApp fetch parameters', function() {
        UrlFetchApp.fetch.and.returnValue({ getResponseCode: () => 200 });
        
        urlFetch.fetch(TEST_URL);

        expect(UrlFetchApp.fetch).toHaveBeenCalledWith(TEST_URL, jasmine.anything());
    });

    it('adds muteHttpExceptions to params in UrlFetchApp', function() {
        var actualParams;
        UrlFetchApp.fetch.and.callFake(function(url, params) { actualParams = params; return OK_RESPONSE; });

        urlFetch.fetch(TEST_URL);

        expect(actualParams["muteHttpExceptions"]).toBe(true);
    });

    it('adds oauth token to headers in UrlFetchApp parameters', function() {
        var actualParams;
        UrlFetchApp.fetch.and.callFake(function(url, params) { actualParams = params; return OK_RESPONSE; });

        urlFetch.fetch(TEST_URL);

        expect(actualParams["headers"]).toEqual({ Authorization: 'Bearer ' + OAUTH_TOKEN });
    });

    it('returns result from UrlFetchApp', function() {
        var EXPECTED = 'TEST RESULT';
        UrlFetchApp.fetch.and.returnValue({ toString: () => EXPECTED, getResponseCode: () => 200});

        expect(urlFetch.fetch(TEST_URL).toString()).toEqual(EXPECTED);
    });

    it('when payload is given it adds a stringified version as payload to UrlFetchApp', function() {
        var actualParams, expectedPayload = { "data": "test" };
        UrlFetchApp.fetch.and.callFake(function(url, params) { actualParams = params; return OK_RESPONSE; });

        urlFetch.fetch(TEST_URL, expectedPayload);

        expect(actualParams["payload"]).toEqual(JSON.stringify(expectedPayload));
    });

    it('when payload is given it sets method to post for UrlFetchApp', function() {
        var actualParams, expectedPayload = { "data": "test" };
        UrlFetchApp.fetch.and.callFake(function(url, params) { actualParams = params; return OK_RESPONSE; });

        urlFetch.fetch(TEST_URL, expectedPayload);

        expect(actualParams["method"]).toEqual("post");
    });

    it('when payload is given it sets content type to json for UrlFetchApp', function() {
        var actualParams, expectedPayload = { "data": "test" };
        UrlFetchApp.fetch.and.callFake(function(url, params) { actualParams = params; return OK_RESPONSE; });

        urlFetch.fetch(TEST_URL, expectedPayload);

        expect(actualParams["contentType"]).toEqual("application/json");
    });
    
    it('undefined payload keeps payload unset for UrlFetchApp', function() {
        var actualParams;
        UrlFetchApp.fetch.and.callFake(function(url, params) { actualParams = params; return OK_RESPONSE; });

        urlFetch.fetch(TEST_URL);

        expect(actualParams["payload"]).toBe(undefined);
    });
    
    it('undefined payload keeps method unset for UrlFetchApp', function() {
        var actualParams;
        UrlFetchApp.fetch.and.callFake(function(url, params) { actualParams = params; return OK_RESPONSE; });

        urlFetch.fetch(TEST_URL);

        expect(actualParams["method"]).toBe(undefined);
    });

    it('undefined payload keeps content type unset for UrlFetchApp', function() {
        UrlFetchApp.fetch.and.callFake(function(url, params) { actualParams = params; return OK_RESPONSE; });

        urlFetch.fetch(TEST_URL);

        expect(actualParams["contentType"]).toBe(undefined);
    });

    it('gets response code 500 it throws exception', function() {
        UrlFetchApp.fetch.and.returnValue({ getResponseCode: () => { return 500; }, toString: () => "<errorhtml><sometag>500</sometag></errorhtml>" });

        expect(() => { urlFetch.fetch(TEST_URL); }).toThrow(Error("HTTP 500 returned when fetching \"" + TEST_URL+ "\": <errorhtml><sometag>500</sometag></errorhtml>"));
    });
});