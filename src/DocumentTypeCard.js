var DocumentTypeCard = function(isActiveUserMailSender) {
    var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle(Strings.DocumentType.CardTitle).setImageUrl(GmailsakIcon.DocumentType));
  
    var section = CardService.newCardSection().setHeader(Strings.DocumentType.CardHeaderTitle);
    section.addWidget(
        CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.RADIO_BUTTON)
            .setFieldName(Fields.DocumentType.Id)
            .setTitle(Strings.DocumentType.DocumentTypeListTitleText)
            .addItem(Strings.DocumentType.DocumentTypeListIngaendeText, Strings.DocumentType.DocumentTypeListIngaendeId, !isActiveUserMailSender)
            .addItem(Strings.DocumentType.DocumentTypeListUtgaendeText, Strings.DocumentType.DocumentTypeListUtgaendeId, isActiveUserMailSender)
            .addItem(Strings.DocumentType.DocumentTypeListXnotatText, Strings.DocumentType.DocumentTypeListXnotatId, false)
    );
    
    section.addWidget(CardService.newTextButton().setText(Strings.DocumentType.ChooseDocumentTypeButtonText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.DocumentType.SetDocumentType })));

    card.addSection(section);

    return card.build();
};