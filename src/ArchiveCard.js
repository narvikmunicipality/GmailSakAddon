var ArchiveCard = function(lastUsedArchiveId, importedJournalPostId) {
    function addAlreadyImportedNotice() {
        if (importedJournalPostId != "0") {
            section.addWidget(CardService.newKeyValue().setTopLabel(Strings.ArchiveId.ImportLogTitle).setContent(importedJournalPostId).setIconUrl(GmailsakIcon.Information));
        }
    }

    var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle(Strings.ArchiveId.CardTitle).setImageUrl(GmailsakIcon.ArchiveId));

    var section = CardService.newCardSection().setHeader(Strings.ArchiveId.CardHeaderTitle);

    section.addWidget(CardService.newTextInput().setFieldName(Fields.ArchiveId.Id).setTitle(Strings.ArchiveId.ArchiveIdTitle).setValue(lastUsedArchiveId.archiveid));
    addAlreadyImportedNotice();
    section.addWidget(CardService.newTextButton().setText(Strings.ArchiveId.SetArchiveIdText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.ArchiveId.SetId })));
    section.addWidget(CardService.newKeyValue().setTopLabel(Strings.Common.TipsAndTricks).setContent(Strings.ArchiveId.SearchTips).setIconUrl(GmailsakIcon.TipsAndTricks).setMultiline(true));

    card.addSection(section);

    return card.build();
};