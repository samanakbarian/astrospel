
# Julias Astero-Räkning: Matte i Rymden

Detta är ett roligt och engagerande webbläsarspel skapat för att hjälpa barn, särskilt Julia, att öva på sina grundläggande mattekunskaper på ett interaktivt sätt. Spelaren måste försvara sin planet från en anstormning av asteroider genom att snabbt lösa de matteproblem som visas på dem.

## Gameplay

-   **Mål:** Skydda din planet från att bli träffad av asteroider.
-   **Hur man spelar:**
    1.  Välj ett räknesätt på startskärmen: Gånger, Plus, Minus, eller Delat.
    2.  Asteroider med matteproblem faller ner från toppen av skärmen.
    3.  Skriv in det korrekta svaret i inmatningsrutan längst ner på skärmen och tryck på Enter.
    4.  Om svaret är korrekt avfyras en laser som förstör motsvarande asteroid och du får poäng.
    5.  Om en asteroid når din planet förlorar planeten 20% av sin hälsa.
    6.  Om du skriver ett felaktigt svar skakar inmatningsrutan och din combo-streak återställs.
-   **Slutet på spelet:** Spelet är över när planetens hälsa når noll. Dina poäng sparas, och om du har slagit ditt tidigare rekord uppdateras din högsta poäng.

## Funktioner

-   **Flera Räknesätt:** Välj mellan multiplikation, addition, subtraktion och division för att anpassa övningen.
-   **Streak & Combo-mätare:** Få bonuspoäng för varje korrekt svar i rad! En combo-mätare visas ovanför ditt rymdskepp för att visa din framgång.
    -   **Bonuspoäng:** +5 poäng extra per korrekt svar i rad (upp till max +50 bonuspoäng per asteroid).
    -   **Återställning:** En miss återställer din streak till noll.
-   **Power-ups via Streaks:** Belönas för långa streaks med kraftfulla förmågor!
    -   **Combo x10 - Sköld:** Planeten får en sköld som blockerar nästa asteroidträff utan att ta skada.
    -   **Combo x20 - Tidsfrys:** Allt på skärmen stannar i 3 sekunder, vilket ger dig tid att tänka.
    -   **Combo x30 - Dubbel-laser:** Under 10 sekunder förstör varje korrekt svar den måltavlan plus en slumpmässig asteroid till!
-   **Målade banor (“Waves”):** Spelet är indelat i vågor. Var 5:e våg ökar svårighetsgraden:
    -   Fler asteroider dyker upp.
    -   Asteroiderna faller lite snabbare.
    -   Talen i matteproblemen blir något större.
-   **Poäng och Högsta Poäng:** Spårar aktuell poäng och sparar den högsta poängen lokalt i webbläsaren med `localStorage`.
-   **Visuell Feedback:**
    -   Smidiga laseranimationer och tydliga power-up-meddelanden.
    -   Visuella effekter som skakningar och blixtar när planeten träffas.
    -   Tydlig feedback för felaktiga svar.
-   **Engagerande Gränssnitt:** Ett rymdtema med en färgglad planet, en rymdskeppskontrollpanel och animerade asteroider.

## Teknisk Översikt

Projektet är byggt med moderna webbteknologier och är helt fristående utan behov av en komplex byggprocess.

-   **Frontend:**
    -   **React:** Används för att bygga det interaktiva användargränssnittet.
    -   **TypeScript:** För typsäkerhet och bättre kodkvalitet.
    -   **Tailwind CSS (via CDN):** För snabb och responsiv styling.
    -   **HTML5 & CSS3:** Inklusive anpassade keyframe-animationer för effekter som lasrar, skakningar och power-ups.

## Filstruktur

```
.
├── index.html          # Huvud-HTML-fil som laddar appen
├── index.tsx           # Ingångspunkt för React-appen
├── App.tsx             # Huvudkomponent som innehåller all spellogik och UI
├── types.ts            # TypeScript-typdefinitioner
├── metadata.json       # Metadata för applikationen
└── README.md           # Denna fil
```

## Hur man kör projektet

Eftersom detta projekt inte använder en bygg-pipeline (som Webpack eller Vite) kan det köras direkt i en webblärare.

1.  **Ladda ner filerna:** Se till att alla projektfiler finns i samma mapp.
2.  **Starta en lokal webbserver:**
    -   Det enklaste sättet är att använda ett tillägg i din kodredigerare, som **Live Server** för VS Code.
    -   Högerklicka på `index.html` och välj "Open with Live Server".
3.  **Öppna i webbläsaren:** Öppna den URL som din lokala server tillhandahåller (oftast `http://localhost:8000` eller liknande).

Spelet bör nu laddas och vara redo att spelas!
