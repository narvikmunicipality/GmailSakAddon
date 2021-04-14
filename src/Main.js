function buildAddOn(e) {
    e["parameters"] = { action: Actions.BuildAddon.BuildAddon };
    return handleAction(e);
}

function filterAddressInfoCodesForSuggestions(e) {
    var authorizedUrlFetch = AuthorizedUrlFetch();
    var addressInfoCodeService = AddressInfoCodeService(authorizedUrlFetch);
    var suggestions = CardService.newSuggestions().addSuggestions(addressInfoCodeService.getSuggestions(e.formInput.f_addressinfo_usercode_id).slice(0, 30));
    return CardService.newSuggestionsResponseBuilder().setSuggestions(suggestions).build();
}

function filterChooseHandlerCodesForSuggestions(e) {
    var authorizedUrlFetch = AuthorizedUrlFetch();
    var chooseHandlerCodeService = ChooseHandlerCodeService(authorizedUrlFetch);
    var suggestions = CardService.newSuggestions().addSuggestions(chooseHandlerCodeService.getSuggestions(e.formInput.f_choosehandler_handlercode_id).slice(0, 30));
    return CardService.newSuggestionsResponseBuilder().setSuggestions(suggestions).build();
}