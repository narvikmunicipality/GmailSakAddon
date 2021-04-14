describe('ArchiveIdService', function() {
    beforeEach(function() {
        urlFetchMock = jasmine.createSpyObj('urlFetchMock', ['fetch']);
        service = ArchiveIdService(urlFetchMock);
    });

    it('get calls web url with correct parameters', function() {
        service.get("2018000001");

        expect(urlFetchMock.fetch).toHaveBeenCalledWith('https://example.com/prod/archiveid?id=2018000001');
    });

    describe('search using shorthand id is expanded to complete id', function() {
        function checkShorthandId(givenId, expectedId) {
            service.get(givenId);

            expect(urlFetchMock.fetch).toHaveBeenCalledWith('https://example.com/prod/archiveid?id=' + expectedId);
        }

        describe('enters wrong slash', function() {
            it('converts slash to correct type', function() {
                checkShorthandId('15\\1', "2015000001");
            });
        });

        describe('with year/id shorthand', function() {

            it('one digit', function() {
                checkShorthandId('15/1', "2015000001");
            });

            it('two digits', function() {
                checkShorthandId('15/10', "2015000010");
            });

            it('three digits', function() {
                checkShorthandId('15/100', "2015000100");
            });

            it('four digits', function() {
                checkShorthandId('15/1000', "2015001000");
            });

            it('five digits', function() {
                checkShorthandId('15/10000', "2015010000");
            });

            it('six digits', function() {
                checkShorthandId('15/100000', "2015100000");
            });
        });

        describe('with id shorthand', function() {
            it('one digit', function() {
                checkShorthandId('1', new Date().getFullYear() + "000001");
            });

            it('two digits', function() {
                checkShorthandId('10', new Date().getFullYear() + "000010");
            });

            it('three digits', function() {
                checkShorthandId('100', new Date().getFullYear() + "000100");
            });

            it('four digits', function() {
                checkShorthandId('1000', new Date().getFullYear() + "001000");
            });

            it('five digits', function() {
                checkShorthandId('10000', new Date().getFullYear() + "010000");
            });

            it('six digits', function() {
                checkShorthandId('100000', new Date().getFullYear() + "100000");
            });
        });
    });

    describe('check if archive id is valid', function() {
        describe('search returns error message when id is in invalid format', function() {
            var expectedErrorResult = JSON.stringify({ "searchError": "Angitt arkivsakID er i ugyldig format." });
            beforeEach(function() {
                urlFetchMock.fetch.and.returnValue(expectedErrorResult);
            });

            it('when id is longer than 10 characters', function() {
                var result = service.get('12345678901');

                expect(result).toBe(expectedErrorResult);
            });

            it('when id is equal to 10 characters but contains illegal characters', function() {
                var result = service.get('b23456789a');

                expect(result).toBe(expectedErrorResult);
            });

            it("when shortform doesn't match rules", function() {
                var result = service.get('1/2');

                expect(result).toBe(expectedErrorResult);
            });

            it('with empty id', function() {
                var result = service.get('');

                expect(result).toBe(expectedErrorResult);
            });

            it('with empty id, but containing whitespace', function() {
                var result = service.get('    \t    \t    \t');

                expect(result).toBe(expectedErrorResult);
            });
        });

        describe('returns search result when archive id is in valid format after cleanup', function() {
            var expectedResult = JSON.stringify({ "archiveid": "2018000001", "archivetitle": "Test title" });

            beforeEach(function() {
                urlFetchMock.fetch.and.returnValue(expectedResult);
            });

            it('when id is equal to 10 characters', function() {
                var result = service.get('1234567890');

                expect(result).toBe(expectedResult);
            });

            it('when valuid id contains whitespace', function() {
                var result = service.get('1\t234 567 8 9\t 0');

                expect(result).toBe(expectedResult);
            });

            it('when shortform matches rules', function() {
                var result = service.get('15/1');

                expect(result).toBe(expectedResult);
            });

            it("when shortform matches rules for higher id's", function() {
                var result = service.get('15/1000');

                expect(result).toBe(expectedResult);
            });

            it('with valid shortform id containing whitespace', function() {
                var result = service.get('  \t 15 \t   / \t 1000\t  ');

                expect(result).toBe(expectedResult);
            });
        });
    });


});