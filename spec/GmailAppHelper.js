var GmailAppHelper = function() {
    var gmailAppMock = jasmine.createSpyObj('GmailApp', ['getMessageById']);

    return gmailAppMock;
};