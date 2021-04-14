var SuggestionsService = function(url, authorizedUrlFetch) {
    return {
        getSuggestions: function(filter) {
            function createQueryStringFromFilter() {
                var query = '';
                for (var prop in filter) {
                    query = "?" + prop + "=" + filter[prop];
                }
                return query;
            }

            var query = createQueryStringFromFilter();
            var result = authorizedUrlFetch.fetch(url + query);

            return JSON.parse(result);
        }
    };
}

