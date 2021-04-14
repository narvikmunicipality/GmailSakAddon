describe('SuggestionsService', function() {
    var service = SuggestionsService(), authFetchMock;
    var TEST_FILTER = { "myfilter": "test" }, TEST_SUGGESTION_URL = 'https://example.com/', TEST_SUGGESTION_URL_WITH_FILTER = 'https://example.com/?myfilter=test', TEST_SUGGESTION_RESULT = '[{"some": "result"}]';

    beforeEach(function() {
        authFetchMock = jasmine.createSpyObj('AuthorizedUrlFetch', ['fetch']);
        authFetchMock.fetch.and.returnValue(TEST_SUGGESTION_RESULT);
        CacheService = CacheServiceHelper();

        service = SuggestionsService(TEST_SUGGESTION_URL, authFetchMock);
    });

    afterEach(function() {
        delete CacheService;
    });

    it('getting suggestions fetches every available item from server', function() {
        service.getSuggestions({});

        expect(authFetchMock.fetch).toHaveBeenCalledWith(TEST_SUGGESTION_URL);
    });

    it('returns correct result when getting suggestions from server', function() {
        expect(service.getSuggestions(TEST_FILTER)).toEqual(JSON.parse(TEST_SUGGESTION_RESULT));
    });

    it('adds filter as query to url', function() {
        service.getSuggestions(TEST_FILTER);

        expect(authFetchMock.fetch).toHaveBeenCalledWith(TEST_SUGGESTION_URL_WITH_FILTER);
    });
});