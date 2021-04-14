describe('ActionHandlerRetryUserCheck', function() {
    var handler = ActionHandlers[Actions.UserCheckError.Retry], eventData = undefined, draftMock, services = undefined, buildAddonMock, original_buildAddonHandler;
    var TEST_BUILDADDON_CARD = 'returned card';

    beforeEach(function() {
        original_buildAddonHandler = ActionHandlers[Actions.BuildAddon.BuildAddon];
        buildAddonMock = jasmine.createSpy(Actions.BuildAddon.BuildAddon);
        buildAddonMock.and.returnValue([TEST_BUILDADDON_CARD]);
        ActionHandlers[Actions.BuildAddon.BuildAddon] = buildAddonMock;

        cardServiceMock = CardServiceHelper();
        CardService = cardServiceMock;
    });

    afterEach(function() {
        ActionHandlers[Actions.BuildAddon.BuildAddon] = original_buildAddonHandler;
    });

    it('is defined in ActionHandlers', function() {
        expect(ActionHandlers[Actions.UserCheckError.Retry]).not.toBeUndefined();
    });

    it('ActionHandler is function', function() {
        expect(typeof (ActionHandlers[Actions.UserCheckError.Retry])).toBe("function");
    });

    describe('replaces current card with result from buildAddon when errortype is UserConfiguration', function() {
        it('returns newActionResponseBuilder', function() {
            expect(handler(eventData, draftMock, services)).toBe(cardServiceMock.newActionResponseBuilderMock);
        });

        it('newActionResponseBuilder gets built', function() {
            handler(eventData, draftMock, services);

            expect(cardServiceMock.newActionResponseBuilderMock.build).toHaveBeenCalled();
        });

        it('sets navigation to newNavigation', function() {
            handler(eventData, draftMock, services);

            expect(cardServiceMock.newActionResponseBuilderMock.setNavigation).toHaveBeenCalledWith(cardServiceMock.newNavigationMock);
        });

        it('navigation is pushed with card from BuildAddon', function() {
            handler(eventData, draftMock, services);

            expect(cardServiceMock.newNavigationMock.pushCard).toHaveBeenCalledWith(TEST_BUILDADDON_CARD);
        });
    });
});
