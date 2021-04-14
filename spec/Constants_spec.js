describe('Constants', function () {
    var GmailsakIconProduction = {
        ArchiveId: "https://example.com/prod/images/ic_folder_open_black_24dp_1x.png",
        JournalPostTitle: "https://example.com/prod/images/ic_short_text_black_24dp_1x.png",
        ChooseHandler: "https://example.com/prod/images/outline_how_to_reg_black_18dp.png",
        DocumentType: "https://example.com/prod/images/ic_label_outline_black_24dp_1x.png",
        AddressInfo: "https://example.com/prod/images/ic_person_outline_black_24dp_1x.png",
        Attachments: "https://example.com/prod/images/ic_attachment_black_24dp_1x.png",
        Import: "https://example.com/prod/images/outline_assessment_black_24dp.png",
        Error: "https://example.com/prod/images/outline_error_outline_black_18dp.png",
        Import: "https://example.com/prod/images/outline_archive_black_18dp.png",
        Information: "https://example.com/prod/images/outline_info_black_18dp.png",
        TipsAndTricks: "https://example.com/prod/images/outline_help_outline_black_18dp.png",
    };

    var UrlsProduction = {
        ArchiveId: {
            Lookup: 'https://example.com/prod/archiveid?id=',
            LastUsed: 'https://example.com/prod/lastarchiveid',
            ImportLog: 'https://example.com/prod/importlog?mailId=',
        },
        Attachment: {
            List: 'https://example.com/prod/attachments/?mailId='
        },
        ChooseHandler: {
            Handlers: "https://example.com/prod/departmentusers",
        },
        Suggestions: {
            AddressInfo: 'https://example.com/prod/address',
        },
        Import: {
            Import: 'https://example.com/prod/import',
        },
        User: {
            WebsakCheck: 'https://example.com/prod/websakcheck'
        }
    }

    describe('GmailsakIcon', function () {
        it('defaults to production URLs when ScriptApp is not defined to not wreck other tests', function () {
            expect(GmailsakIcon).toEqual(GmailsakIconProduction);
        });
    });

    describe('Urls', function () {
        it('defaults to production URLs when ScriptApp is not defined to not wreck other tests', function () {
            expect(Urls).toEqual(UrlsProduction);
        });
    });
});