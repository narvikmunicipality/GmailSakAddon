var JournalPostDraft = function() {
    var _internalData = {
        _archiveId: '',
        _journalPostTitle: '',
        _documentType: '',
        _attachmentInfo: [],
        _addressInfo: {},
        _handler: '',
    };

    return {
        /**
        * @return {Integer} Returns currently set archive ID.
        */
        getArchiveId: function() { return _internalData._archiveId; },

        /**
        * @param {Integer} New archive ID value.
        */
        setArchiveId: function(id) { _internalData._archiveId = id; },

        /**
        * @return {String} Returns currently set journalpost title.
        */
        getJournalPostTitle: function() { return _internalData._journalPostTitle; },

        /**
        * @param {String} New journalpost title value.
        */
        setJournalPostTitle: function(title) { _internalData._journalPostTitle = title; },

        /**
        * @return {String} Returns currently set documenttype value.
        */
        getDocumentType: function() { return _internalData._documentType; },

        /**
        * @param {String} New documenttype value.
        */
        setDocumentType: function(documentType) { _internalData._documentType = documentType; },

        /**
        * @return {String} Returns currently set address info object.
        */
        getAddressInfo: function() { return _internalData._addressInfo; },

        /**
        * @param {String} New address info object
        */
        setAddressInfo: function(addressInfo) { _internalData._addressInfo = addressInfo; },

        /**
        * @return {String} Returns currently set attachment info object.
        */
        getAttachment: function() { return _internalData._attachmentInfo; },

        /**
        * @param {String} New attachment info object
        */
        setAttachment: function(attachmentInfo) { _internalData._attachmentInfo = attachmentInfo; },
        
        /**
        * @return {String} Returns currently set handler value.
        */
       getHandler: function() { return _internalData._handler; },

       /**
       * @param {String} New handler value
       */
       setHandler: function(handler) { _internalData._handler = handler; },

        _getInternalDataObject: function() { return _internalData; },
        _setInternalDataObject: function(data) { _internalData = data }
    }
};