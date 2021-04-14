var ImportLogService = function(authorizedUrlFetch, mailId) {
    return {
        getLastId: function() {
            return JSON.parse(authorizedUrlFetch.fetch(Urls.ArchiveId.ImportLog + mailId)).imported;
        }
    };
};