var LastUsedArchiveIdService = function(authorizedUrlFetch) {
    return {
        getArchiveId: function() {
            return JSON.parse(authorizedUrlFetch.fetch(Urls.ArchiveId.LastUsed));
        }
    }
}