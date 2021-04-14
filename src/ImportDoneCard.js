var ImportDoneCard = function(journalPostId) {
    var card = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle(Strings.Import.CardTitle).setImageUrl(GmailsakIcon.Import))
        .addSection(CardService.newCardSection().setHeader(Strings.Import.CardHeaderTitleImported).addWidget(CardService.newTextParagraph().setText(Strings.Import.ImportedJournalPostId + journalPostId)))
        .build();
    return card;
};