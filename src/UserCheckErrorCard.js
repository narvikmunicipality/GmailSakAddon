var UserCheckErrorCard = function() {
    var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle(Strings.UserCheckError.CardTitle).setImageUrl(GmailsakIcon.Error));

    var section = CardService.newCardSection().setHeader(Strings.UserCheckError.CardHeaderTitle);
    section.addWidget(CardService.newTextParagraph().setText(Strings.UserCheckError.UserConfigurationError));
    section.addWidget(CardService.newTextButton().setText(Strings.UserCheckError.RetryButtonText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.UserCheckError.Retry })));

    card.addSection(section);

    return card.build();
};