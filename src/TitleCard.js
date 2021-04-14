var TitleCard = function(messageId) {
    var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle(Strings.JournalPostTitle.CardTitle).setImageUrl(GmailsakIcon.JournalPostTitle));

    var section = CardService.newCardSection().setHeader(Strings.JournalPostTitle.CardHeaderTitle);
    section.addWidget(CardService.newTextInput().setFieldName(Fields.JournalPostTitle.Id).setTitle(Strings.JournalPostTitle.TitleTextTitle).setValue(GmailApp.getMessageById(messageId).getSubject()));
    section.addWidget(CardService.newTextButton().setText(Strings.JournalPostTitle.SetTitleTextText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.JournalPostTitle.SetTitle })));

    card.addSection(section);

    return card.build();
};