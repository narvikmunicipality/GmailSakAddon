var ErrorMessageCard = function(title, cardTitle, message) {
    var card = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader()
            .setTitle(title)
            .setImageUrl(GmailsakIcon.Error))
        .addSection(CardService.newCardSection()
            .setHeader(cardTitle)
            .addWidget(CardService.newTextParagraph()
                .setText(message)))
        .build();
    return card;
}