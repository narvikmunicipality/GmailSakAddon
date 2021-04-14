var System = {
    AppsScriptIdForDevelopmentVersion: '1cHCIPSPrUrCCWeOfjh2CYyu2KUcSHK006XoVZQy4_LE3rXrUKrGH7lle',
    ActionHandlerFunction: "handleAction",
    ChooseHandlerCodeSuggestionsFunction: "filterChooseHandlerCodesForSuggestions",
    AddressInfoCodeSuggestionsFunction: "filterAddressInfoCodesForSuggestions",
};

// Make this "static dynamic", so it can choose development URLs if running as the test version script.
// Defaults to production URLs if ScriptApp is not defined, which it isn't while running tests, but it is tested that it returns correct URLs.
// Development URLs will only work when running the addon from Gmail and has to be tested manually.
var GmailsakIcon = function () {
    var addonVersion = typeof ScriptApp !== 'undefined' && ScriptApp.getScriptId() === System.AppsScriptIdForDevelopmentVersion ? 'test' : 'prod';

    return {
        ArchiveId: "https://example.com/" + addonVersion + "/images/ic_folder_open_black_24dp_1x.png",
        JournalPostTitle: "https://example.com/" + addonVersion + "/images/ic_short_text_black_24dp_1x.png",
        ChooseHandler: "https://example.com/" + addonVersion + "/images/outline_how_to_reg_black_18dp.png",
        DocumentType: "https://example.com/" + addonVersion + "/images/ic_label_outline_black_24dp_1x.png",
        AddressInfo: "https://example.com/" + addonVersion + "/images/ic_person_outline_black_24dp_1x.png",
        Attachments: "https://example.com/" + addonVersion + "/images/ic_attachment_black_24dp_1x.png",
        Import: "https://example.com/" + addonVersion + "/images/outline_assessment_black_24dp.png",
        Error: "https://example.com/" + addonVersion + "/images/outline_error_outline_black_18dp.png",
        Import: "https://example.com/" + addonVersion + "/images/outline_archive_black_18dp.png",
        Information: "https://example.com/" + addonVersion + "/images/outline_info_black_18dp.png",
        TipsAndTricks: "https://example.com/" + addonVersion + "/images/outline_help_outline_black_18dp.png",
    }
}();

var Actions = {
    ArchiveId: { SetId: "a_archiveid_setid" },
    JournalPostTitle: { SetTitle: "a_journalposttitle_settitle" },
    ChooseHandler: { SetHandlerCode: "a_choosehandler_sethandlercode" },
    DocumentType: { SetDocumentType: "a_documenttype_setdocumenttype" },
    AddressInfo: {
        SetAddressInfo: "a_addressinfo_setaddressinfo",
        SetUserCode: "a_addressinfo_setusercode"
    },
    UserCheckError: { Retry: "a_usercheckerror_retry" },
    Attachment: { SetAttachment: "a_attachment_setattachments" },
    Summary: { StartImport: "a_summary_startimport" },
    BuildAddon: { BuildAddon: "a_buildaddon_buildaddon" },
};

var Fields = {
    ArchiveId: { Id: "f_archiveid_id" },
    JournalPostTitle: { Id: "f_journalposttitle_title" },
    ChooseHandler: { HandlerCodeId: "f_choosehandler_handlercode_id" },
    DocumentType: { Id: "f_documenttype_id" },
    AddressInfo: {
        UserCodeId: "f_addressinfo_usercode_id",
        FullnameId: "f_addressinfo_fullname_id",
        AddressId: "f_addressinfo_address_id",
        MailId: "f_addressinfo_mail_id",
        ZipCodeId: "f_addressinfo_zipcode_id",
        CityId: "f_addressinfo_city_id",
    },
    Attachment: {
        MainDocument: "f_attachment_maindocument_id",
        Attachments: "f_attachment_attachments_id",
    }
};

var Strings = {
    ArchiveId: {
        CardTitle: "Arkivsak",
        CardHeaderTitle: "Velg arkivsak",
        ArchiveIdTitle: "ArkivsakID",
        SetArchiveIdText: "Velg",
        InvalidArchiveIdMessage: "Angitt arkivsakID er i ugyldig format.",
        InvalidServerMessage: "Feil med serverkommunikasjon. Feilsøk-ID: ",
        MissingArchiveId: "Du må fylle inn et arkivsaknummer!",
        ImportLogTitle: "Allerede importert med følgende ID:",
        SearchTips: 'Søketips:<br>• <i>123</i> - Søk frem i årets saker med kun saksnummer.<br>• <i>17/123</i> - Søk frem saksnummer (123) i angitt år (2017).<br>• <i>2016000123</i> - Søk frem sak med fullt saksnummer.',
    },
    JournalPostTitle: {
        CardTitle: "Journalpost",
        CardHeaderTitle: "Skriv inn tittel",
        TitleTextTitle: "Tittel",
        SetTitleTextText: "Velg",
        MissingJournalPostTitle: "Du må skrive inn en tittel!"
    },
    ChooseHandler: {
        CardTitle: "Saksbehandler",
        CardHeaderTitle: "Velg saksbehandler",
        HandlerCodeTextTitle: "Kode",
        SetHandlerCodeButtonText: "Velg",
        MissingHandlerCode: "Du må fylle ut en saksbehandlerkode!",
        InvalidHandlerCode: 'Saksbehandlerkoden finnes ikke!',
    },
    DocumentType: {
        CardTitle: "Dokumenttype",
        CardHeaderTitle: "Velg dokumenttype",
        DocumentTypeListTitleText: "Dokumenttyper",
        DocumentTypeListIngaendeText: "I - Inngående brev",
        DocumentTypeListUtgaendeText: "U - Utgående brev",
        DocumentTypeListXnotatText: "X - Internt notat uten oppfølging",
        ChooseDocumentTypeButtonText: "Velg",
        DocumentTypeListIngaendeId: "I",
        DocumentTypeListUtgaendeId: "U",
        DocumentTypeListXnotatId: "X",
    },
    AddressInfo: {
        CardTitleSender: "Mottaker",
        CardTitleReceiver: "Avsender",
        CardHeaderTitleUserCode: "Legg til manuelt",
        CardHeaderTitleAddress: "Legg til manuelt",
        UserCodeTextTitle: "Kode",
        FullnameTextTitle: "Navn",
        AddressTextTitle: "Adresse",
        MailTextTitle: "E-postadresse",
        ZipCodeTextTitle: "Postnummer",
        CityTextTitle: "Poststed",
        SetAddressInfoButtonText: "Velg",
        MissingUserCode: "Du må fylle ut en saksbehandlerkode!",
        InvalidUserCode: 'Saksbehandler finnes ikke!',
        MissingFullname: 'Du må oppgi et navn!',
        DuplicateCodeTips: 'Duplikate koder får lagt til f.eks. "#1234" etter koden. Koden blir fjernet ved import og må legges til manuelt i Websak.',
    },
    Attachment: {
        CardTitle: "Vedlegg",
        CardHeaderMainDocumentTitle: "Velg hoveddokument",
        CardHeaderAttachmentsTitle: "Velg vedlegg",
        MainDocumentSelectionTitle: "Dokumenter",
        AttachmentSelectionTitle: "Vedlegg",
        SetAttachmentsButtonText: "Velg",
        UnsupportedFiles: "Følgende filer støttes ikke i Websak:",
        UnsupportedFilesTips: 'Filtyper som ikke er lagt til i Websak kan ikke importeres før de blir lagt til av en systemansvarlig.',
    },
    Summary: {
        CardTitle: "Sammendrag",
        CardHeaderTitle: "Journalpost",
        ArchiveIdLabel: "ArkivsakId",
        ChooseHandlerLabel: "Saksbehandler",
        JournalPostTitleLabel: "Tittel",
        DocumentTypeLabel: "Dokumenttype",
        AddressInfoUserCodeLabel: "Mottaker",
        AddressInfoReceiverLabel: "Avsender",
        AddressInfoSenderLabel: "Mottaker",
        AttachmentLabel: "Vedlegg",
        ImportLabel: "Fullfør import",
        StartImportButtonText: "Importér",
    },
    Import: {
        CardTitle: "Import",
        CardHeaderTitle: "Importeringen feilet",
        CardHeaderTitleImported: "Importeringen var vellykket!",
        InternalImportError: "Det har oppstått en teknisk feil! Diagnose-ID: ",
        ImportedJournalPostId: "Journalposten er opprettet med følgende ID:<br>",
        ImportedJournalPostDone: "Importert!"
    },
    ActionHandler: {
        NotSet: "Action handler not set.",
        Invalid: "Action handler not found: ",
        ErrorCardTitle: 'Gmailsak',
        ErrorCardHeaderTitle: 'Systemfeil',
        GenericError: 'Det oppstod en intern feil i Gmailsak. Feilsøk-ID: '
    },
    UserCheckError: {
        CardTitle: "Brukersjekk",
        CardHeaderTitle: "Ikke godkjent for import",
        UserConfigurationError: "Brukeren din er ikke koblet opp mot e-postadressen du er innlogget som eller mangler enhetstilhørighet i Websak.",
        RetryButtonText: "Prøv igjen",
    },
    Common: {
        ErrorCardTitlePostfix: " - feil",
        TipsAndTricks: "Hurtigveiledning",
    }
};

var Urls = function () {
    var addonVersion = typeof ScriptApp !== 'undefined' && ScriptApp.getScriptId() === System.AppsScriptIdForDevelopmentVersion ? 'test' : 'prod';

    return {
        ArchiveId: {
            Lookup: 'https://example.com/' + addonVersion + '/archiveid?id=',
            LastUsed: 'https://example.com/' + addonVersion + '/lastarchiveid',
            ImportLog: 'https://example.com/' + addonVersion + '/importlog?mailId=',
        },
        Attachment: {
            List: 'https://example.com/' + addonVersion + '/attachments/?mailId='
        },
        ChooseHandler: {
            Handlers: 'https://example.com/' + addonVersion + '/departmentusers',
        },
        Suggestions: {
            AddressInfo: 'https://example.com/' + addonVersion + '/address',
        },
        Import: {
            Import: 'https://example.com/' + addonVersion + '/import',
        },
        User: {
            WebsakCheck: 'https://example.com/' + addonVersion + '/websakcheck'
        }
    }
}();