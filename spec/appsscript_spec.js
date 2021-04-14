describe('appsscript.json', function() {
    var appsscript;

    beforeEach(function() {
        appsscript = require('../../src/appsscript.json');
    });

    describe('oauthScopes', function() {
        it('property is defined', function() {
            expect(appsscript.oauthScopes).toBeDefined();
        });

        it('has gmail addons execute scope', function() {
            expect(appsscript.oauthScopes).toContain("https://www.googleapis.com/auth/gmail.addons.execute");
        });

        it('has gmail readonly scope', function() {
            expect(appsscript.oauthScopes).toContain("https://www.googleapis.com/auth/gmail.readonly");
        });

        it('has script external request scope', function() {
            expect(appsscript.oauthScopes).toContain("https://www.googleapis.com/auth/script.external_request");
        });
    });

    describe('gmail', function() {
        it('property is defined', function() {
            expect(appsscript.gmail).toBeDefined();
        });

        it('name is set correctly', function() {
            expect(appsscript.gmail.name).toBe("Gmailsak");
        });

        it('logoUrl is set correctly', function() {
            expect(appsscript.gmail.logoUrl).toBe("https://example.com/prod/images/gmailsak-20x20.png");
        });

        describe('contextualTriggers', function() {
            it('property is defined', function() {
                expect(appsscript.gmail.contextualTriggers).toBeDefined();
            });

            it('property contains exactly one item', function() {
                expect(appsscript.gmail.contextualTriggers.length).toBe(1);
            });

            it('unconditional property contains an empty object', function() {
                expect(appsscript.gmail.contextualTriggers[0].unconditional).toEqual({});
            });

            it('onTriggerFunction is set to correct main entry function name', function() {
                expect(appsscript.gmail.contextualTriggers[0].onTriggerFunction).toBe("buildAddOn");
            });
        });

        describe('urlFetchWhitelist', function() {
            it('property is defined', function() {
                expect(appsscript.urlFetchWhitelist).toBeDefined();
            });

            it('has gmailsak archive id search URL', function() {
                expect(appsscript.urlFetchWhitelist).toContain("https://example.com/prod/archiveid");
            });

            it('has gmailsak address search URL', function() {
                expect(appsscript.urlFetchWhitelist).toContain("https://example.com/prod/address");
            });

            it('has gmailsak attachment list URL', function() {
                expect(appsscript.urlFetchWhitelist).toContain("https://example.com/prod/attachments");
            });

            it('has gmailsak last archive id lookup URL', function() {
                expect(appsscript.urlFetchWhitelist).toContain("https://example.com/prod/lastarchiveid");
            });

            it('has gmailsak import URL', function() {
                expect(appsscript.urlFetchWhitelist).toContain('https://example.com/prod/import');
            });

            it('has gmailsak import log URL', function() {
                expect(appsscript.urlFetchWhitelist).toContain('https://example.com/prod/importlog');
            });

            it('has gmailsak choose handler URL', function() {
                expect(appsscript.urlFetchWhitelist).toContain('https://example.com/prod/departmentusers');
            });

            it('has gmailsak websak check URL', function() {
                expect(appsscript.urlFetchWhitelist).toContain('https://example.com/prod/websakcheck');
            });
        });

        it('primaryColor is set correctly', function() {
            expect(appsscript.gmail.primaryColor).toBe("#4285F4");
        });

        it('secondaryColor is set correctly', function() {
            expect(appsscript.gmail.secondaryColor).toBe("#4285F4");
        });

        it('version is set to required value for addon to work', function() {
            expect(appsscript.gmail.version).toBe("TRUSTED_TESTER_V2");
        });
    });
});