var CacheServiceHelper = function() {
    var userCacheMock = jasmine.createSpyObj('getUserCache', ['get', 'put', 'remove']);

    var cacheServiceHelper = jasmine.createSpyObj('CacheService', ['getUserCache']);
    cacheServiceHelper.getUserCache.and.returnValue(userCacheMock);
    cacheServiceHelper.userCacheMock = userCacheMock;

    return cacheServiceHelper;
}