var AttachmentCard = function(attachments) {
    function addNonImportableAttachmentTips() {
        if (hasNonImportableAttachments()) {
            section.addWidget(CardService.newKeyValue().setTopLabel(Strings.Common.TipsAndTricks).setContent(Strings.Attachment.UnsupportedFilesTips).setIconUrl(GmailsakIcon.TipsAndTricks).setMultiline(true));
        }
    }

    function hasNonImportableAttachments() {
        for (var i = 0; i < attachments.length; ++i) {
            if (!attachments[i].isImportable) {
                return true;
            }
        }
    }

    function addListOfNonImportableAttachments() {
        var nonImportableAttachments = '';
        for (var i = 0; i < attachments.length; ++i) {
            if (!attachments[i].isImportable) {
                nonImportableAttachments += "<br><i>" + attachments[i].text + "</i>";
            }
        }

        if (nonImportableAttachments) {
            section.addWidget(CardService.newTextParagraph().setText(Strings.Attachment.UnsupportedFiles + nonImportableAttachments));
        }
    }

    function addCheckboxListOfAttachmentsToSection() {
        var attachmentSelectionInput = CardService.newSelectionInput().setFieldName(Fields.Attachment.Attachments).setType(CardService.SelectionInputType.CHECK_BOX).setTitle(Strings.Attachment.AttachmentSelectionTitle);

        for (var i = 0; i < attachments.length; ++i) {
            if (attachments[i].isImportable) {
                attachmentSelectionInput.addItem(attachments[i].text, attachments[i].id, true);
            }
        }

        section.addWidget(attachmentSelectionInput);
    }

    function addRadioListOfAttachmentsToSection() {
        var mainDocumentSelectionInput = CardService.newSelectionInput().setFieldName(Fields.Attachment.MainDocument).setType(CardService.SelectionInputType.RADIO_BUTTON).setTitle(Strings.Attachment.MainDocumentSelectionTitle);
        for (var i = 0; i < attachments.length; ++i) {
            if (attachments[i].isImportable) {
                mainDocumentSelectionInput.addItem(attachments[i].text, attachments[i].id, i == 0);
            }
        }
        section.addWidget(mainDocumentSelectionInput);
    }    

    var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle(Strings.Attachment.CardTitle).setImageUrl(GmailsakIcon.Attachments));

    var section = CardService.newCardSection().setHeader(Strings.Attachment.CardHeaderMainDocumentTitle);
    addRadioListOfAttachmentsToSection();
    card.addSection(section);

    section = CardService.newCardSection().setHeader(Strings.Attachment.CardHeaderAttachmentsTitle);
    addCheckboxListOfAttachmentsToSection();
    addListOfNonImportableAttachments();

    section.addWidget(CardService.newTextButton().setText(Strings.Attachment.SetAttachmentsButtonText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.Attachment.SetAttachment })));
    addNonImportableAttachmentTips();
    card.addSection(section);

    return card.build();
};