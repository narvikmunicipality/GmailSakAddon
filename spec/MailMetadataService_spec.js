describe('MailMetadataService', function () {
    var service;
    var TEST_MESSAGE_ID = 'testId';

    describe('isActiveUserSender', function() {        
        var TEST_ACTIVE_MAIL_ADDRESS = 'active@example.com', TEST_SENDER_MAIL_ADDRESS;

        beforeEach(function() {           
            Session = SessionHelper();
            Session.getActiveUser.and.returnValue({ getEmail: function() { return TEST_ACTIVE_MAIL_ADDRESS; } });

            GmailApp = GmailAppHelper();
            GmailApp.getMessageById.and.returnValue({ getFrom: function() { return TEST_SENDER_MAIL_ADDRESS; } });

            service = MailMetadataService(null, TEST_MESSAGE_ID);
        });

        afterEach(function() {
            delete GmailApp;
            delete Session;
        });

        describe('returns false when from is not equal to active user', function() {
            it('with clean mail address', function() {
                TEST_SENDER_MAIL_ADDRESS = 'sender@example.com';

                expect(service.isActiveUserSender()).toBe(false);
            });

            it('with mail address containing name', function() {
                TEST_SENDER_MAIL_ADDRESS = 'SenderName <sender@example.com>';

                expect(service.isActiveUserSender()).toBe(false);
            });
            
            it('with mail address containing name and quotes', function() {
                TEST_SENDER_MAIL_ADDRESS = '"Sender Name" <sender@example.com>';

                expect(service.isActiveUserSender()).toBe(false);
            });

            it('with mail address containing similar address as active', function() {
                TEST_SENDER_MAIL_ADDRESS = '"Not Same" <not.active@example.com>';

                expect(service.isActiveUserSender()).toBe(false);
            });
        });


        describe('returns true when from address is equal to active user', function() {
            it('with clean mail address', function() {
                TEST_SENDER_MAIL_ADDRESS = 'active@example.com';

                expect(service.isActiveUserSender()).toBe(true);
            });

            it('with mail address containing name', function() {
                TEST_SENDER_MAIL_ADDRESS = 'ActiveName <active@example.com>';

                expect(service.isActiveUserSender()).toBe(true);
            });
            
            it('with mail address containing name and quotes', function() {
                TEST_SENDER_MAIL_ADDRESS = '"Active Name" <active@example.com>';

                expect(service.isActiveUserSender()).toBe(true);
            });            
        });        
    });
});