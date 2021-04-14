var ImportService = function(authorizedUrlFetch, mailId) {
    function generateImportDraftAttachmentList(attachments) {
        var converted = []

        for (var i = 0; i < attachments.length; ++i) {
            converted.push({ attachmentId: attachments[i].id, mainDocument: attachments[i].main });
        }

        return converted;
    }

    return {
        import: function(journalPostDraft) {
            var importDraft = {
                mailId: mailId,
                archiveId: journalPostDraft.getArchiveId().archiveid,
                title: journalPostDraft.getJournalPostTitle(),
                documentType: journalPostDraft.getDocumentType(),
                attachments: generateImportDraftAttachmentList(journalPostDraft.getAttachment()),
            };

            if (journalPostDraft.getAddressInfo().UserCode) {
                importDraft.senderCode = journalPostDraft.getAddressInfo().UserCode;
            } else {
                importDraft.senderName = journalPostDraft.getAddressInfo().Name;
                importDraft.senderAddress = journalPostDraft.getAddressInfo().Address;
                importDraft.senderMail = journalPostDraft.getAddressInfo().Mail;
                importDraft.senderZipCode = journalPostDraft.getAddressInfo().ZipCode;
                importDraft.senderCity = journalPostDraft.getAddressInfo().City;
            }

            if (journalPostDraft.getHandler()) {
                var extractedHandlerCode = journalPostDraft.getHandler().match('^[^:]*')[0];
                importDraft.handler = extractedHandlerCode;
            }

            var response = authorizedUrlFetch.fetch(Urls.Import.Import, importDraft);

            if (response.getResponseCode() == 200) {
                return JSON.parse(response.getContentText());
            } else {
                var uuid = Utilities.getUuid();
                console.log("ImportService import result (" + uuid + "): " + response.getContentText());
                return { status: "ERROR", message: Strings.Import.InternalImportError + uuid };
            }
        }
    };
};