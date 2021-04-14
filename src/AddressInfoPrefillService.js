var AddressInfoPrefillService = function(addressInfoCodeService, journalPostDraft, messageId) {
    function ownerHasSentCurrentMail() { return journalPostDraft.getDocumentType() == Strings.DocumentType.DocumentTypeListUtgaendeId; }
    function isActiveUserAddress(mail) { return mail == ownerMail; }
    function containsMultipleAddresses(mail) { return mail.split(",").length > 1; }
    var nameAndMailRegEx = RegExp('"?([^"]+)"? <(.*)>'), mailAngleBrackets = / *<|>/g;

    function splitOutMailIfItContainsName(mail) {
        if (nameAndMailRegEx.test(mail)) {            
            return nameAndMailRegEx.exec(mail)[2];
        }
        return mail.replace(mailAngleBrackets, '');
    }

    function splitOutNameInRawMailAddress() {
        var mail = ownerHasSentCurrentMail() ? message.getTo() : message.getFrom();
        if (nameAndMailRegEx.test(mail)) {
            return nameAndMailRegEx.exec(mail)[1];
        }
        return '';
    }

    function getNonOwnerMailAddress() {
        var mail;

        if (ownerHasSentCurrentMail()) {
            mail = splitOutMailIfItContainsName(message.getTo());

            if (isActiveUserAddress(mail) || containsMultipleAddresses(mail)) {
                mail = '';
            }

        } else {
            mail = splitOutMailIfItContainsName(message.getFrom());

            if (isActiveUserAddress(mail)) {
                mail = '';
            }
        }

        return mail;
    }

    var message = GmailApp.getMessageById(messageId), ownerMail = Session.getActiveUser().getEmail();

    return {
        getUserCode: function() {
            var mail = getNonOwnerMailAddress();
            return mail ? addressInfoCodeService.getSuggestion(mail) : '';
        },

        getEmailAddress: function() {
            return getNonOwnerMailAddress();
        },

        getFullname: function() {
            if (getNonOwnerMailAddress() != '') {
                return splitOutNameInRawMailAddress();
            } else {
                return '';
            }
        }
    };
};