var ArchiveIdService = function(urlFetch) {
    function fixWrongSlash(id) {
        return id.replace('\\', '/');
    }

    function completeArchiveId(id) {
        function zeroPadding(max) {
            var padded = '';
            for (var i = 0; i < max - id.length; i++) {
                padded += '0';
            }
            return padded;
        }

        id = id.replace(/\s+/g, '');

        if (id.indexOf('/') != -1) {
            return '20' + id.replace('/', zeroPadding(9));
        }
        else if (id.length <= 6 && id.length > 0) {
            return new Date().getFullYear() + zeroPadding(6) + id;
        } else {
            return id;
        }
    }

    function isValidArchiveId(id) {
        var idRegex = new RegExp('^(\\d{10}|\\d\\d/\\d{1,6}|\\d{1,6})$');
        return idRegex.test(id.replace(/\s+/g, ''));
    }

    return {
        get: function(id) {
            id = fixWrongSlash(id);

            if (isValidArchiveId(id)) {
                return urlFetch.fetch(Urls.ArchiveId.Lookup + completeArchiveId(id));
            }
            else {
                return JSON.stringify({ "searchError": Strings.ArchiveId.InvalidArchiveIdMessage });
            }
        }
    };
}