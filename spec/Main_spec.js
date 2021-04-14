describe('Main', function() {
    describe('buildAddOn', function() {
        var eventdata, original_handleAction;

        beforeEach(function() {
            eventdata = {};
            original_handleAction = handleAction;
            handleAction = jasmine.createSpy('handleAction');
        });

        afterEach(function() {
            handleAction = original_handleAction;
        });

        it('calls handleAction with eventdata', function() {
            buildAddOn(eventdata);

            expect(handleAction).toHaveBeenCalledWith(eventdata);
        });

        it('adds buildaddon action to eventdata', function() {
            var actualEventData;
            handleAction.and.callFake(function(e) { actualEventData = e; });

            buildAddOn(eventdata);

            expect(actualEventData.parameters.action).toEqual(Actions.BuildAddon.BuildAddon);
        });
    });

    describe('filterAddressInfoCodesForSuggestions', function() {
        var original_authorizedUrlFetch, addressInfoCodeServiceMock, parameters, eventdata, original_addressInfoCodeService;

        beforeEach(function() {
            parameters = {};
            parameters[Fields.AddressInfo.UserCodeId] = "expected";
            eventdata = { formInput: parameters };

            CardService = CardServiceHelper();
            original_authorizedUrlFetch = AuthorizedUrlFetch;
            AuthorizedUrlFetch = jasmine.createSpy('AuthorizedUrlFetch');
            AuthorizedUrlFetch.and.returnValue(AuthorizedUrlFetch);

            original_addressInfoCodeService = AddressInfoCodeService;
            addressInfoCodeServiceMock = jasmine.createSpyObj(AddressInfoCodeService, ['getSuggestions']);
            addressInfoCodeServiceMock.getSuggestions.and.returnValue(createExpectedResultsWithItems(1));
            AddressInfoCodeService = jasmine.createSpy(AddressInfoCodeService);
            AddressInfoCodeService.and.returnValue(addressInfoCodeServiceMock);
        });

        afterEach(function() {
            delete CardService;
            AuthorizedUrlFetch = original_authorizedUrlFetch;
            AddressInfoCodeService = original_addressInfoCodeService;
        });

        it('returns created suggestion response', function() {
            expect(filterAddressInfoCodesForSuggestions(eventdata)).toBe(CardService.newSuggestionsResponseBuilderMock);
        });

        it('suggestion response is built', function() {
            filterAddressInfoCodesForSuggestions(eventdata);

            expect(CardService.newSuggestionsResponseBuilderMock.build).toHaveBeenCalled();
        });

        it('sets response with suggestions', function() {
            filterAddressInfoCodesForSuggestions(eventdata);

            expect(CardService.newSuggestionsResponseBuilderMock.setSuggestions).toHaveBeenCalledWith(CardService.suggestionMocks[0]);
        });

        it('creates suggestions', function() {
            filterAddressInfoCodesForSuggestions(eventdata);

            expect(CardService.newSuggestions).toHaveBeenCalled();
        });

        it('set suggestions with result from service', function() {
            var expectedResult = ['a', 'b', 'c'];
            addressInfoCodeServiceMock.getSuggestions.and.returnValue(expectedResult);

            filterAddressInfoCodesForSuggestions(eventdata);

            expect(CardService.suggestionMocks[0].addSuggestions).toHaveBeenCalledWith(expectedResult);
        });

        it('caps suggestions result at thirty items', function() {
            addressInfoCodeServiceMock.getSuggestions.and.returnValue(createExpectedResultsWithItems(60));

            filterAddressInfoCodesForSuggestions(eventdata);

            expect(CardService.suggestionMocks[0].addSuggestions).toHaveBeenCalledWith(createExpectedResultsWithItems(30));
        });

        it('AuthorizedUrlFetch is created', function() {
            filterAddressInfoCodesForSuggestions(eventdata);

            expect(AuthorizedUrlFetch).toHaveBeenCalled();
        });

        it('creates with internal note user code service with authorized url fetch', function() {
            filterAddressInfoCodesForSuggestions(eventdata);

            expect(AddressInfoCodeService).toHaveBeenCalledWith(AuthorizedUrlFetch);
        });

        it('passes text from text input to suggestion filter', function() {
            filterAddressInfoCodesForSuggestions(eventdata);

            expect(addressInfoCodeServiceMock.getSuggestions).toHaveBeenCalledWith("expected");
        });

        function createExpectedResultsWithItems(count) {
            var items = [];
            for (var i = 1; i <= count; ++i) { items.push(String(i) + ": Lastname, Firstname"); }
            return items;
        }
    });

    describe('filterChooseHandlerCodesForSuggestions', function() {
        var original_authorizedUrlFetch, original_chooseHandlerCodeService, chooseHandlerCodeServiceMock, parameters, eventdata;

        beforeEach(function() {
            parameters = {};
            parameters[Fields.ChooseHandler.HandlerCodeId] = "expected";
            eventdata = { formInput: parameters };

            CardService = CardServiceHelper();
            original_authorizedUrlFetch = AuthorizedUrlFetch;
            AuthorizedUrlFetch = jasmine.createSpy('AuthorizedUrlFetch');
            AuthorizedUrlFetch.and.returnValue(AuthorizedUrlFetch);

            original_chooseHandlerCodeService = ChooseHandlerCodeService;
            chooseHandlerCodeServiceMock = jasmine.createSpyObj('ChooseHandlerCodeService', ['getSuggestions']);
            chooseHandlerCodeServiceMock.getSuggestions.and.returnValue(createExpectedResultsWithItems(1));
            ChooseHandlerCodeService = jasmine.createSpy('ChooseHandlerCodeService');
            ChooseHandlerCodeService.and.returnValue(chooseHandlerCodeServiceMock);
        });

        afterEach(function() {
            delete CardService;
            AuthorizedUrlFetch = original_authorizedUrlFetch;
            ChooseHandlerCodeService = original_chooseHandlerCodeService;
        });

        it('returns created suggestion response', function() {
            expect(filterChooseHandlerCodesForSuggestions(eventdata)).toBe(CardService.newSuggestionsResponseBuilderMock);
        });

        it('suggestion response is built', function() {
            filterChooseHandlerCodesForSuggestions(eventdata);

            expect(CardService.newSuggestionsResponseBuilderMock.build).toHaveBeenCalled();
        });

        it('sets response with suggestions', function() {
            filterChooseHandlerCodesForSuggestions(eventdata);

            expect(CardService.newSuggestionsResponseBuilderMock.setSuggestions).toHaveBeenCalledWith(CardService.suggestionMocks[0]);
        });

        it('creates suggestions', function() {
            filterChooseHandlerCodesForSuggestions(eventdata);

            expect(CardService.newSuggestions).toHaveBeenCalled();
        });

        it('set suggestions with result from service', function() {
            var expectedResult = ['a', 'b', 'c'];
            chooseHandlerCodeServiceMock.getSuggestions.and.returnValue(expectedResult);

            filterChooseHandlerCodesForSuggestions(eventdata);

            expect(CardService.suggestionMocks[0].addSuggestions).toHaveBeenCalledWith(expectedResult);
        });

        it('caps suggestions result at thirty items', function() {
            chooseHandlerCodeServiceMock.getSuggestions.and.returnValue(createExpectedResultsWithItems(60));

            filterChooseHandlerCodesForSuggestions(eventdata);

            expect(CardService.suggestionMocks[0].addSuggestions).toHaveBeenCalledWith(createExpectedResultsWithItems(30));
        });

        it('AuthorizedUrlFetch is created', function() {
            filterChooseHandlerCodesForSuggestions(eventdata);

            expect(AuthorizedUrlFetch).toHaveBeenCalled();
        });

        it('creates ChooseHandlerCodeService with AuthorizedUrlFetch', function() {
            filterChooseHandlerCodesForSuggestions(eventdata);

            expect(ChooseHandlerCodeService).toHaveBeenCalledWith(AuthorizedUrlFetch);
        });

        it('passes text from text input to suggestion filter', function() {
            filterChooseHandlerCodesForSuggestions(eventdata);

            expect(chooseHandlerCodeServiceMock.getSuggestions).toHaveBeenCalledWith("expected");
        });

        function createExpectedResultsWithItems(count) {
            var items = [];
            for (var i = 1; i <= count; ++i) { items.push(String(i) + ": Last, First [SOMEDEPT]"); }
            return items;
        }
    });
});