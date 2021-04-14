var MailMetadataService = function(authorizedUrlFetch, messageId) {
    return {
        isActiveUserSender: function() {
            var activeUserMail = Session.getActiveUser().getEmail();
            var fromAddress = GmailApp.getMessageById(messageId).getFrom();

            return fromAddress == activeUserMail || fromAddress.indexOf('<' + activeUserMail + '>') != -1;
        }
    }
}