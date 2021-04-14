var ChooseHandlerCodeService = function(authorizedUrlFetch) {
    function convertResultToSuggestionStyle(result) {
        var converted = [];
        for (var departmentIndex = 0; departmentIndex < result.length; ++departmentIndex) {
            var currentDepartment = result[departmentIndex];
            for (var userIndex = 0; userIndex < currentDepartment.users.length; ++userIndex) {
                var currentUser = currentDepartment.users[userIndex];
                converted.push(currentUser.userCode + ": " + currentUser.userName + " [" + currentDepartment.departmentCode + "]");
            }
        }
        return converted;
    }

    var suggestionService = SuggestionsService(Urls.ChooseHandler.Handlers, authorizedUrlFetch);

    return {
        getSuggestions: function(filter) {
            function filterMatches(filter) {
                var tokens = filter.split(' ');

                for (var i = 0; i < tokens.length; ++i) {
                    if (!(currentUser.userName.toLowerCase().indexOf(tokens[i].toLowerCase()) !== -1 ||
                        currentUser.userCode.toLowerCase().indexOf(tokens[i].toLowerCase()) !== -1 ||
                        currentDepartment.departmentName.toLowerCase().indexOf(tokens[i].toLowerCase()) !== -1 ||
                        currentDepartment.departmentCode.toLowerCase().indexOf(tokens[i].toLowerCase()) !== -1)) {
                        return false;
                    }

                }
                return true;
            }

            var result = suggestionService.getSuggestions();
            var filtered = [];

            if (filter) {
                for (var departmentIndex = 0; departmentIndex < result.length; ++departmentIndex) {
                    var currentDepartment = result[departmentIndex], filteredUsers = [];
                    for (var userIndex = 0; userIndex < currentDepartment.users.length; ++userIndex) {
                        var currentUser = currentDepartment.users[userIndex];

                        if (filterMatches(filter)) {
                            filteredUsers.push(currentUser);
                        }
                    }

                    currentDepartment.users = filteredUsers;
                    filtered.push(currentDepartment);
                }
            } else {
                filtered = result;
            }

            return convertResultToSuggestionStyle(filtered);
        }
    }
};