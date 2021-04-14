describe('AddressInfoCodeService', function() {
    var service, authFetchMock, suggestionsServiceMock;

    beforeEach(function() {
        original_suggestionsService = SuggestionsService;
        authFetchMock = jasmine.createSpy('AuthorizedFetchUrl');
        suggestionsServiceMock = jasmine.createSpyObj('SuggestionsService', ['getSuggestions']);
        suggestionsServiceMock.getSuggestions.and.returnValue([]);
        SuggestionsService = jasmine.createSpy('SuggestionsService');
        SuggestionsService.and.returnValue(suggestionsServiceMock);

        service = AddressInfoCodeService(authFetchMock);
    });

    afterEach(function() {
        SuggestionsService = original_suggestionsService;
    });

    describe('getSuggestions', function() {
        it('creates suggestionsservice with correct parameters', function() {
            expect(SuggestionsService).toHaveBeenCalledWith('https://example.com/prod/address', authFetchMock);
        });

        it('no filter value uses empty code filter parameter on SuggestionService', function() {
            service.getSuggestions();

            expect(suggestionsServiceMock.getSuggestions).toHaveBeenCalledWith({ "code": "" });
        });

        it('provided filter value is set in code parameter on SuggestionService', function() {
            service.getSuggestions("expected_code_search");

            expect(suggestionsServiceMock.getSuggestions).toHaveBeenCalledWith({ "code": "expected_code_search" });
        });

        it('returns formatted result from suggestion service', function() {
            var expectedResult = createExpectedResultsWithItems(30);
            suggestionsServiceMock.getSuggestions.and.returnValue(createResultWithItems(30));

            expect(service.getSuggestions()).toEqual(expectedResult);
        });

        it('returns formatted result from suggestion service when items are marked duplicate', function() {
            var expectedResult = createExpectedResultsWithItems(30, true);
            suggestionsServiceMock.getSuggestions.and.returnValue(createResultWithItems(30, true));

            expect(service.getSuggestions()).toEqual(expectedResult);
        });
    });

    describe('getSuggestion', function() {
        var TEST_MAIL = 'test@example.com';

        it('returns result when search yields single item', function() {
            var expectedResult = createExpectedResultsWithItems(1)[0];
            suggestionsServiceMock.getSuggestions.and.returnValue(createResultWithItems(1));

            expect(service.getSuggestion(TEST_MAIL)).toEqual(expectedResult);
        });

        it('provided filter value is set in mail parameter on SuggestionService', function() {
            service.getSuggestion("expected_code_search");

            expect(suggestionsServiceMock.getSuggestions).toHaveBeenCalledWith({ "mail": "expected_code_search" });
        });

        it('returns empty string when search returns no items', function() {
            suggestionsServiceMock.getSuggestions.and.returnValue([]);

            expect(service.getSuggestion(TEST_MAIL)).toEqual('');
        });

        it('returns empty string when search returns more than one item', function() {
            suggestionsServiceMock.getSuggestions.and.returnValue(createResultWithItems(2));

            expect(service.getSuggestion(TEST_MAIL)).toEqual('');
        });
    });

    describe('getFullSuggestion', function() {
        it('returns matching item when retrieving single matching code without duplicate', function() {
            suggestionsServiceMock.getSuggestions.and.returnValue(createResultWithItems(1, false));

            expect(service.getFullSuggestion(createExpectedResultsWithItems(1)[0])).toEqual({ "id": "1337", "code": "USER1", "name": "Lastname, Firstname", "address1": "Testveien 1", "zipcode": "8515", "city": "NARVIK", "mail": "firstname.lastname@example.com", "duplicate": false });
        });

        it('searches for correct code when given suggestionItem without duplicate id', function() {
            service.getFullSuggestion(createExpectedResultsWithItems(1)[0]);

            expect(suggestionsServiceMock.getSuggestions).toHaveBeenCalledWith({ "code": "USER1" });
        });

        it('returns matching item when retrieving multiple items with duplicates', function() {
            suggestionsServiceMock.getSuggestions.and.returnValue([{ "id": "41", "code": "USER2", "name": "Lastname, Firstname", "address1": "Testveien 1", "zipcode": "8515", "city": "NARVIK", "mail": "firstname.lastname@example.com", "duplicate": true }, { "id": "42", "code": "USER2", "name": "Lastname, Firstname", "address1": "Testveien 1", "zipcode": "8515", "city": "NARVIK", "mail": "firstname.lastname@example.com", "duplicate": true }, { "id": "43", "code": "USER2", "name": "Lastname, Firstname", "address1": "Testveien 1", "zipcode": "8515", "city": "NARVIK", "mail": "firstname.lastname@example.com", "duplicate": true }]);

            expect(service.getFullSuggestion("USER2#42: Lastname, Firstname")).toEqual({ "id": "42", "code": "USER2", "name": "Lastname, Firstname", "address1": "Testveien 1", "zipcode": "8515", "city": "NARVIK", "mail": "firstname.lastname@example.com", "duplicate": true });
        });

        it('searches for correct code when given suggestionItem has duplicate id', function() {
            service.getFullSuggestion(createExpectedResultsWithItems(1, true)[0]);

            expect(suggestionsServiceMock.getSuggestions).toHaveBeenCalledWith({ "code": "USER1" });
        });
    });

    function createResultWithItems(count, duplicate) {
        var items = [];
        for (var i = 1; i <= count; ++i) { items.push({ "id": "1337", "code": "USER" + String(i), "name": "Lastname, Firstname", "address1": "Testveien 1", "zipcode": "8515", "city": "NARVIK", "mail": "firstname.lastname@example.com", "duplicate": duplicate }); }
        return items;
    }

    function createExpectedResultsWithItems(count, duplicate) {
        var items = [];
        for (var i = 1; i <= count; ++i) { items.push("USER" + String(i) + (duplicate ? "#1337" : '') + ": Lastname, Firstname"); }
        return items;
    }
});