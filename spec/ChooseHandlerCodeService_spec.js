describe('ChooseHandlerCodeService', function() {
    var service, authFetchMock, suggestionsServiceMock;

    beforeEach(function() {
        original_suggestionsService = SuggestionsService;
        authFetchMock = jasmine.createSpy('AuthorizedFetchUrl');
        suggestionsServiceMock = jasmine.createSpyObj('SuggestionsService', ['getSuggestions']);
        suggestionsServiceMock.getSuggestions.and.returnValue([]);
        SuggestionsService = jasmine.createSpy('SuggestionsService');
        SuggestionsService.and.returnValue(suggestionsServiceMock);

        service = ChooseHandlerCodeService(authFetchMock);
    });

    afterEach(function() {
        SuggestionsService = original_suggestionsService;
    });

    it('creates suggestionsservice with correct parameters', function() {
        expect(SuggestionsService).toHaveBeenCalledWith('https://example.com/prod/departmentusers', authFetchMock);
    });

    it('when getting results from suggestions service it calls suggestion service without parameters', function() {
        service.getSuggestions();

        expect(suggestionsServiceMock.getSuggestions).toHaveBeenCalledWith();
    });

    it('returns the result from suggestion service', function() {
        var expectedResult = getExpectedServiceTestResult();
        suggestionsServiceMock.getSuggestions.and.returnValue(getServiceTestResult());

        expect(service.getSuggestions()).toEqual(expectedResult);
    });

    it('filters results based on user name', function() {
        var expectedResult = ['USER1: Test, User [ADEPT]'];
        suggestionsServiceMock.getSuggestions.and.returnValue(getServiceTestResult());

        expect(service.getSuggestions('uSeR')).toEqual(expectedResult);
    });

    it('filters results based on user code', function() {
        var expectedResult = ['TESTEPOST: E-post, Test [EPOSTDEPT]'];
        suggestionsServiceMock.getSuggestions.and.returnValue(getServiceTestResult());

        expect(service.getSuggestions('testepost')).toEqual(expectedResult);
    });

    it('filters results based on department name', function() {
        var expectedResult = ['USER1: Test, User [ADEPT]'];
        suggestionsServiceMock.getSuggestions.and.returnValue(getServiceTestResult());

        expect(service.getSuggestions('aNoThEr')).toEqual(expectedResult);
    });

    it('filters results based on department code', function() {
        var expectedResult = ['TESTEPOST: E-post, Test [EPOSTDEPT]'];
        suggestionsServiceMock.getSuggestions.and.returnValue(getServiceTestResult());

        expect(service.getSuggestions('epostd')).toEqual(expectedResult);
    });

    it('filters results only matching all tokens #1', function() {
        var expectedResult = ['TESTEPOST: E-post, Test [EPOSTDEPT]'];
        suggestionsServiceMock.getSuggestions.and.returnValue(getServiceTestResult());

        expect(service.getSuggestions('test post')).toEqual(expectedResult);
    });

    it('filters results only matching all tokens #2', function() {
        var expectedResult = ["USER1: Test, User [ADEPT]"];
        suggestionsServiceMock.getSuggestions.and.returnValue(getServiceTestResult());

        expect(service.getSuggestions('adept another')).toEqual(expectedResult);
    });

    function getServiceTestResult() {
        return [{ "departmentCode": "EPOSTDEPT", "departmentName": "E-post Department", "users": [{ "userCode": "TESTEPOST", "userName": "E-post, Test" }] }, { "departmentCode": "ADEPT", "departmentName": "Another Department", "users": [{ "userCode": "USER1", "userName": "Test, User" }] }];
    }

    function getExpectedServiceTestResult() {
        return ["TESTEPOST: E-post, Test [EPOSTDEPT]", "USER1: Test, User [ADEPT]"];
    }
});