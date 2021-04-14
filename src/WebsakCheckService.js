var WebsakCheckService = function(authorizedUrlFetch) {
    return {
        getUserStatus: function() {
            return JSON.parse(authorizedUrlFetch.fetch(Urls.User.WebsakCheck));
        }
    };
};