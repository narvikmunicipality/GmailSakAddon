var MailAttachmentsService = function(authorizedUrlFetch, mailId) {
    return {
        getAttachments: function() {
            return JSON.parse(authorizedUrlFetch.fetch(Urls.Attachment.List + mailId));
        }
    }
}