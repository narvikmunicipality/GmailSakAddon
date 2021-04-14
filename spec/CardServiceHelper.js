var CardServiceHelper = function() {
    var cardServiceMock, newCardBuilderMock, newCardHeaderMock, newActionResponseBuilderMock, newNavigationMock, newAuthorizationExceptionMock, newSuggestionsResponseBuilderMock;
    var sectionMocks = [], widgetMocks = [], actionMocks = [], suggestionMocks = [];

    function createUniqueActionMock() {
        var action = jasmine.createSpyObj('newAction', ['setFunctionName', 'setParameters']);
        action.setFunctionName.and.returnValue(action);
        action.setParameters.and.returnValue(action);

        actionMocks.push(action);

        return action;
    }

    function createUniqueAuthorizationActionMock() {
        var action = jasmine.createSpyObj('newAuthorizationAction', ['setAuthorizationUrl']);
        action.setAuthorizationUrl.and.returnValue(action);

        actionMocks.push(action);

        return action;
    }

    function createUniqueTextInputMock() {
        var input = jasmine.createSpyObj('newTextInput', ['setFieldName', 'setTitle', 'setValue', 'setSuggestionsAction']);
        input.setFieldName.and.returnValue(input);
        input.setTitle.and.returnValue(input);
        input.setValue.and.returnValue(input);
        input.setSuggestionsAction.and.returnValue(input);

        widgetMocks.push(input);

        return input;
    }

    function createUniqueTextButtonMock() {
        var button = jasmine.createSpyObj('newTextButton', ['setText', 'setOnClickAction', 'setAuthorizationAction']);
        button.setText.and.returnValue(button);
        button.setOnClickAction.and.returnValue(button);
        button.setAuthorizationAction.and.returnValue(button);

        widgetMocks.push(button);

        return button;
    }

    function createUniqueSectionMock() {
        var section = jasmine.createSpyObj('newCardSection', ['setHeader', 'addWidget'])
        section.setHeader.and.returnValue(section);
        section.addWidget.and.returnValue(section);

        sectionMocks.push(section);

        return section;
    }

    function createUniqueInputSelectionMock() {
        var selectionInput = jasmine.createSpyObj('newSelectionInput', ['setType', 'setTitle', 'setFieldName', 'addItem']);
        selectionInput.setType.and.returnValue(selectionInput);
        selectionInput.setTitle.and.returnValue(selectionInput);
        selectionInput.setFieldName.and.returnValue(selectionInput);
        selectionInput.addItem.and.returnValue(selectionInput);

        widgetMocks.push(selectionInput);

        return selectionInput;
    }

    function createUniqueKeyValueMock() {
        var button = jasmine.createSpyObj('newKeyValue', ['setTopLabel', 'setContent', 'setIconUrl', 'setMultiline']);
        button.setTopLabel.and.returnValue(button);
        button.setContent.and.returnValue(button);
        button.setIconUrl.and.returnValue(button);
        button.setMultiline.and.returnValue(button);

        widgetMocks.push(button);

        return button;
    }

    function createUniqueTextParagraphMock() {
        var textParagraph = jasmine.createSpyObj('newTextParagraphMock', ['setText']);
        textParagraph.setText.and.returnValue(textParagraph);

        widgetMocks.push(textParagraph);

        return textParagraph;
    }

    function createUniqueSuggestionMock() {
        var suggestion = jasmine.createSpyObj('newSuggestions', ['addSuggestions']);
        suggestion.addSuggestions.and.returnValue(suggestion);

        suggestionMocks.push(suggestion);

        return suggestion;
    }

    newActionResponseBuilderMock = jasmine.createSpyObj('newActionResponseBuilder', ['setNavigation', 'build']);
    newActionResponseBuilderMock.setNavigation.and.returnValue(newActionResponseBuilderMock);
    newActionResponseBuilderMock.build.and.returnValue(newActionResponseBuilderMock);

    newNavigationMock = jasmine.createSpyObj('newNavigationMock', ['pushCard']);
    newNavigationMock.pushCard.and.returnValue(newNavigationMock);

    newCardBuilderMock = jasmine.createSpyObj('newCardBuilder', ['setHeader', 'addSection', 'build']);
    newCardBuilderMock.setHeader.and.returnValue(newCardBuilderMock);
    newCardBuilderMock.addSection.and.returnValue(newCardBuilderMock);
    newCardBuilderMock.build.and.returnValue(newCardBuilderMock);

    newCardHeaderMock = jasmine.createSpyObj('newCardHeader', ['setTitle', 'setImageUrl']);
    newCardHeaderMock.setTitle.and.returnValue(newCardHeaderMock);
    newCardHeaderMock.setImageUrl.and.returnValue(newCardHeaderMock);

    newAuthorizationExceptionMock = jasmine.createSpyObj('newAuthorizationException', ['setAuthorizationUrl', 'setResourceDisplayName', 'setCustomUiCallback', 'throwException']);
    newAuthorizationExceptionMock.setAuthorizationUrl.and.returnValue(newAuthorizationExceptionMock);
    newAuthorizationExceptionMock.setResourceDisplayName.and.returnValue(newAuthorizationExceptionMock);
    newAuthorizationExceptionMock.setCustomUiCallback.and.returnValue(newAuthorizationExceptionMock);

    newSuggestionsResponseBuilderMock = jasmine.createSpyObj('newSuggestionsResponseBuilder', ['setSuggestions', 'build']);
    newSuggestionsResponseBuilderMock.setSuggestions.and.returnValue(newSuggestionsResponseBuilderMock);
    newSuggestionsResponseBuilderMock.build.and.returnValue(newSuggestionsResponseBuilderMock);

    cardServiceMock = jasmine.createSpyObj('CardService', ['newCardBuilder', 'newCardHeader', 'newCardSection', 'newTextInput', 'newTextButton', 'newAction', 'newActionResponseBuilder', 'newNavigation', 'newSelectionInput', 'newKeyValue', 'newAuthorizationException', 'newTextParagraph', 'newAuthorizationAction', 'newSuggestionsResponseBuilder', 'newSuggestions']);
    cardServiceMock.newCardBuilder.and.returnValue(newCardBuilderMock);
    cardServiceMock.newCardHeader.and.returnValue(newCardHeaderMock);
    cardServiceMock.newCardSection.and.callFake(createUniqueSectionMock);
    cardServiceMock.newTextInput.and.callFake(createUniqueTextInputMock);
    cardServiceMock.newTextButton.and.callFake(createUniqueTextButtonMock);
    cardServiceMock.newKeyValue.and.callFake(createUniqueKeyValueMock);
    cardServiceMock.newAction.and.callFake(createUniqueActionMock);
    cardServiceMock.newSuggestions.and.callFake(createUniqueSuggestionMock);
    cardServiceMock.newAuthorizationAction.and.callFake(createUniqueAuthorizationActionMock);
    cardServiceMock.newTextParagraph.and.callFake(createUniqueTextParagraphMock);
    cardServiceMock.newSelectionInput.and.callFake(createUniqueInputSelectionMock);
    cardServiceMock.newActionResponseBuilder.and.returnValue(newActionResponseBuilderMock);
    cardServiceMock.newNavigation.and.returnValue(newNavigationMock);
    cardServiceMock.newAuthorizationException.and.returnValue(newAuthorizationExceptionMock);
    cardServiceMock.newSuggestionsResponseBuilder.and.returnValue(newSuggestionsResponseBuilderMock);

    cardServiceMock.newCardBuilderMock = newCardBuilderMock;
    cardServiceMock.newCardHeaderMock = newCardHeaderMock;
    cardServiceMock.newActionResponseBuilderMock = newActionResponseBuilderMock;
    cardServiceMock.newNavigationMock = newNavigationMock;
    cardServiceMock.newAuthorizationExceptionMock = newAuthorizationExceptionMock;
    cardServiceMock.newSuggestionsResponseBuilderMock = newSuggestionsResponseBuilderMock;
    cardServiceMock.sectionMocks = sectionMocks;
    cardServiceMock.widgetMocks = widgetMocks;
    cardServiceMock.actionMocks = actionMocks;
    cardServiceMock.suggestionMocks = suggestionMocks;

    cardServiceMock.SelectionInputType = { RADIO_BUTTON: "TEST_VALUE_RADIO_BUTTON", CHECK_BOX: "TEST_VALUE_CHECK_BOX" };

    return cardServiceMock;
};