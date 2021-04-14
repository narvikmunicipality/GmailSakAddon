var AuthorizedUrlFetch = function () {
    return {
        fetch: function (url, payload) {
            var params = {
                "muteHttpExceptions": true,
                headers: {
                    Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
                }
            };

            if (payload) {
                params["payload"] = JSON.stringify(payload);
                params["method"] = "post";
                params["contentType"] = "application/json";
            }

            var result = UrlFetchApp.fetch(url, params);

            if (result.getResponseCode() == 500) {
                throw new Error("HTTP 500 returned when fetching \"" + url + "\": " + result);
            }

            return result;
        }
    }
};