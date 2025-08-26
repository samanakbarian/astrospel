# Julias Astero-Räkning: Gångertabellen i Rymden

Detta är ett roligt och engagerande webbläsarspel skapat för att hjälpa barn, särskilt Julia, att öva på sina gångertabeller på ett interaktivt sätt. Spelaren måste försvara sin planet från en anstormning av asteroider genom att snabbt lösa de multiplikationsproblem som visas på dem.

## Gameplay

-   **Mål:** Skydda din planet från att bli träffad av asteroider.
-   **Hur man spelar:**
    1.  Asteroider med multiplikationsproblem (från 2:ans till 10:ans tabell) faller ner från toppen av skärmen.
    2.  Skriv in det korrekta svaret i inmatningsrutan längst ner på skärmen och tryck på Enter.
    3.  Om svaret är korrekt avfyras en laser som förstör motsvarande asteroid och du får 10 poäng.
    4.  Om en asteroid når din planet förlorar planeten 20% av sin hälsa.
    5.  Om du skriver ett felaktigt svar skakar inmatningsrutan.
-   **Slutet på spelet:** Spelet är över när planetens hälsa når noll. Dina poäng sparas, och om du har slagit ditt tidigare rekord uppdateras din högsta poäng.

## Funktioner

-   **Dynamisk Spelmekanik:** Asteroider genereras kontinuerligt med slumpmässiga multiplikationsproblem.
-   **Poäng och Högsta Poäng:** Spårar aktuell poäng och sparar den högsta poängen lokalt i webbläsaren med `localStorage`.
-   **Visuell Feedback:**
    -   Smidiga laseranimationer när en asteroid förstörs.
    -   Visuella effekter som skakningar och blixtar när planeten träffas.
    -   Tydlig feedback för felaktiga svar.
-   **Engagerande Gränssnitt:** Ett rymdtema med en färgglad planet, en rymdskeppskontrollpanel och animerade asteroider.
-   **Enkel och Intuitiv:** Designad för att vara lätt att förstå och spela för barn.

## Teknisk Översikt

Projektet är byggt med moderna webbteknologier och är helt fristående utan behov av en komplex byggprocess.

-   **Frontend:**
    -   **React:** Används för att bygga det interaktiva användargränssnittet.
    -   **TypeScript:** För typsäkerhet och bättre kodkvalitet.
    -   **Tailwind CSS (via CDN):** För snabb och responsiv styling.
    -   **HTML5 & CSS3:** Inklusive anpassade keyframe-animationer för effekter som lasrar, skakningar och explosioner.

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

Eftersom detta projekt inte använder en bygg-pipeline (som Webpack eller Vite) kan det köras direkt i en webbläsare.

1.  **Ladda ner filerna:** Se till att alla projektfiler (`index.html`, `index.tsx`, `App.tsx`, `types.ts`) finns i samma mapp.
2.  **Starta en lokal webbserver:**
    -   Det enklaste sättet är att använda ett tillägg i din kodredigerare, som **Live Server** för VS Code.
    -   Högerklicka på `index.html` och välj "Open with Live Server".
    -   Alternativt kan du använda en enkel kommandoradsserver. Om du har Python installerat, navigera till projektmappen i din terminal och kör:
        ```bash
        # För Python 3
        python -m http.server
        ```
3.  **Öppna i webbläsaren:** Öppna den URL som din lokala server tillhandahåller (oftast `http://localhost:8000` eller liknande).

Spelet bör nu laddas och vara redo att spelas!
