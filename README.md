# GmailSakAddOn

## Forhåndsarbeid
Installér Node.js: https://nodejs.org/en/

Installér clasp ved å kjøre: .\build.ps1 -Target "npm install"

Slå på "Google Apps Script API" på din bruker her: https://script.google.com/home/usersettings

Logg på clasp med din egen bruker ved å kjøre følgende: clasp login

For å kunne laste opp endringer fra byggeskriptet må du gå innom Gmailsak-prosjektet for domenenet, også test-prosjektet, og dele de med din egen bruker.

## Laste opp endringer
Når du kjører byggeskriptet uten parametre så lastes endringene dine kun opp til test-prosjektet.
For å oppdatere alle prosjektene samtidig så kjører du byggeskriptet på følgende måte: .\build.ps1 -Target all
Du kan også laste opp endringene til et enkelt domene ved å angi en av følgende som target:
- dev
- example.com

Endringer som lastes opp blir ikke satt i produksjon umiddelbart, så det er trygt å laste opp til alle når som helst.

## Sette i drift opplastede endringer
1. Åpne scripts-prosjektet fra adressene over.
2. Velg "Fil" → "Administrer versjoner ...".
3. Trykk på "Save new version" og husk versjonstallet.
2. Velg "Publiser" → "Implementer fra manifest...".
3. Finn "Gmailsak"-deploymenten i listen og trykk "Edit".
4. Velg versjonstallet du fikk i steg 3 og trykk "Save".

Endringene trer i kraft ved at du oppdatere Gmail-fanen din.