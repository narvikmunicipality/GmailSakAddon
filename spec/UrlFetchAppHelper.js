var UrlFetchAppHelper = function() {
    var responseMock = jasmine.createSpyObj('HTTPResponse', ['getHeaders', 'getContentText', 'getResponseCode']);
    var appMock = jasmine.createSpyObj('UrlFetchApp', ['fetch']);
    appMock.fetch.and.returnValue(responseMock);

    appMock.responseMock = responseMock;

    return appMock;
};