var AddressInfoCodeService = function(authorizedUrlFetch) {
    function convertResultToSuggestionStyle(result) {
        function createIdentifierIfDuplicateCode() {
            return item.duplicate ? "#" + item.id : '';
        }

        var converted = [];

        for (var i = 0; i < result.length; ++i) {
            var item = result[i];
            converted.push(item.code + createIdentifierIfDuplicateCode() + ": " + item.name);
        }

        return converted;
    }

    var suggestionsService = SuggestionsService(Urls.Suggestions.AddressInfo, authorizedUrlFetch);

    return {
        getSuggestions: function(filter) {
            return convertResultToSuggestionStyle(suggestionsService.getSuggestions({ "code": (filter ? filter : '') }));
        },
        getSuggestion: function(mail) {
            function isSingleItem() { return results.length == 1; }

            var results = suggestionsService.getSuggestions({ "mail": (mail ? mail : '') });

            return isSingleItem() ? convertResultToSuggestionStyle(results)[0] : '';
        },
        getFullSuggestion: function(suggestionItem) {
            var fullCodeRegexp = RegExp('^([^:]+):.*');
            var fullCode = suggestionItem.match(fullCodeRegexp)[1];
            var codeAndIdRegexp = RegExp('(.*)#(.*)');
            var id, code;

            if (fullCode.match(codeAndIdRegexp)) {
                var match = fullCode.match(codeAndIdRegexp);
                code = match[1];
                id = match[2];
            } else {
                code = fullCode;
            }

            var result = suggestionsService.getSuggestions({ "code": code });
            for (var i = 0; i < result.length; ++i) {
                if (id && id == result[i].id && code == result[i].code || !id && code == result[i].code) {
                    return result[i];
                }
            }
        }
    };
}