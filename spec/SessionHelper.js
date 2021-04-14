var SessionHelper = function() {
    var sessionMock = jasmine.createSpyObj('Session', ['getActiveUser']);

    return sessionMock;   
};