var ChooseHandlerCard = function() {
    var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle(Strings.ChooseHandler.CardTitle).setImageUrl(GmailsakIcon.ChooseHandler));

    var section = CardService.newCardSection().setHeader(Strings.ChooseHandler.CardHeaderTitle);
    section.addWidget(CardService.newTextInput().setFieldName(Fields.ChooseHandler.HandlerCodeId).setTitle(Strings.ChooseHandler.HandlerCodeTextTitle).setSuggestionsAction(CardService.newAction().setFunctionName(System.ChooseHandlerCodeSuggestionsFunction)));
    section.addWidget(CardService.newTextButton().setText(Strings.ChooseHandler.SetHandlerCodeButtonText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.ChooseHandler.SetHandlerCode })));
    card.addSection(section);

    return card.build();
};