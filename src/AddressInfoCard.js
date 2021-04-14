var AddressInfoCard = function (messageId, journalPostDraft, addressInfoPrefill) {
    var cardTitleBasedOnDocumentType = journalPostDraft.getDocumentType() == Strings.DocumentType.DocumentTypeListIngaendeId ? Strings.AddressInfo.CardTitleReceiver : Strings.AddressInfo.CardTitleSender;
    var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle(cardTitleBasedOnDocumentType).setImageUrl(GmailsakIcon.AddressInfo));

    var section = CardService.newCardSection().setHeader(Strings.AddressInfo.CardHeaderTitleAddress);
    section.addWidget(CardService.newTextInput().setFieldName(Fields.AddressInfo.FullnameId).setTitle(Strings.AddressInfo.FullnameTextTitle).setValue(addressInfoPrefill.getFullname()));
    section.addWidget(CardService.newTextInput().setFieldName(Fields.AddressInfo.AddressId).setTitle(Strings.AddressInfo.AddressTextTitle));
    section.addWidget(CardService.newTextInput().setFieldName(Fields.AddressInfo.MailId).setTitle(Strings.AddressInfo.MailTextTitle).setValue(addressInfoPrefill.getEmailAddress()));
    section.addWidget(CardService.newTextInput().setFieldName(Fields.AddressInfo.ZipCodeId).setTitle(Strings.AddressInfo.ZipCodeTextTitle));
    section.addWidget(CardService.newTextInput().setFieldName(Fields.AddressInfo.CityId).setTitle(Strings.AddressInfo.CityTextTitle));
    section.addWidget(CardService.newTextButton().setText(Strings.AddressInfo.SetAddressInfoButtonText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.AddressInfo.SetAddressInfo })));
    card.addSection(section);

    section = CardService.newCardSection().setHeader(Strings.AddressInfo.CardHeaderTitleUserCode);
    section.addWidget(CardService.newTextInput().setFieldName(Fields.AddressInfo.UserCodeId).setTitle(Strings.AddressInfo.UserCodeTextTitle).setSuggestionsAction(CardService.newAction().setFunctionName(System.AddressInfoCodeSuggestionsFunction)).setValue(addressInfoPrefill.getUserCode()));
    section.addWidget(CardService.newTextButton().setText(Strings.AddressInfo.SetAddressInfoButtonText).setOnClickAction(CardService.newAction().setFunctionName(System.ActionHandlerFunction).setParameters({ action: Actions.AddressInfo.SetUserCode })));
    section.addWidget(CardService.newKeyValue().setTopLabel(Strings.Common.TipsAndTricks).setContent(Strings.AddressInfo.DuplicateCodeTips).setIconUrl(GmailsakIcon.TipsAndTricks).setMultiline(true));
    card.addSection(section);

    return card.build();
};