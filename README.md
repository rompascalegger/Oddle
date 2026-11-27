# Oddle – Schätz die Chance 🎯

Das tägliche Schätzspiel über Wahrscheinlichkeiten für **dicele.io** (`oddle.dicele.io`, verlinkt über playle.io). Jeden Tag gibt es fünf Zufallsfragen, für alle dieselben: Wie wahrscheinlich ist ein Pasch mit drei Würfeln? Wie gross ist die Chance, dass in einer Klasse zwei am selben Tag Geburtstag haben? Du schiebst einen Regler auf deine Schätzung, dann regnen 10 000 simulierte Versuche in ein Histogramm und der exakte Wert aus der Kombinatorik rastet ein.

## Spielen

Kein Build, keine Abhängigkeiten: lokal ausliefern und öffnen:

```bash
python -m http.server 5341
```

Dann <http://localhost:5341> öffnen. `index.html` geht auch direkt per Doppelklick; dann rechnet die Simulation im Hauptthread statt im Web Worker.

Mit `?dev=1` erscheinen Testknöpfe (Tag vor/zurück, Tag neu starten, alles löschen) und `window.oddle` in der Konsole.

Nach Änderungen die Versionsnummer `?v=` in `index.html` (und in `js/app.js` beim Worker) erhöhen, damit Browser und GitHub Pages keine alten Dateien mischen.

## Coreloop

1. **Frage lesen:** Szenario-Animation (Würfel, Karten, Münzen, Lotto, Roulette, Leute, Alltag). Antippen spielt sie neu ab.
2. **Bauchgefühl:** Regler von 0 bis 100 %. Unter 5 % und über 95 % schaltet er in den **Feinmodus** mit Zehntelschritten. Optional der **Hinweis-Joker** 💡 (einmal pro Tag, zeigt die Grössenordnung, kostet 20 Punkte).
3. **Einloggen:** Die Simulation läuft 3 Sekunden mit Trommelwirbel. Pakete à 100 Versuche fallen ins Histogramm, der Zähler nähert sich der Wahrheit.
4. **Auflösung:** Punkte, Abweichung (Prozentpunkte und Faktor in den Odds), exakter Bruch, aufklappbarer Rechenweg. Volltreffer lösen Konfetti und einen Bullseye-Sound aus.
5. **Weiter:** Nach Frage 5 kommen Tagesergebnis, Emoji-Zeile zum Teilen, Rang und Countdown bis Mitternacht.

## Wertung

| | |
| --- | --- |
| Punkte pro Frage | `max(0, 100 − 25 · \|logit(Tipp) − logit(Wahrheit)\|)` |
| Volltreffer | ±1 Prozentpunkt (unter 5 % und über 95 %: ±0,2) → **+20** |
| Hinweis-Joker | 1× pro Tag, −20 |
| Fragen pro Tag | 5 |
| Simulationen pro Frage | 10 000 |

Auf der Log-Odds-Skala zählt «1 % statt 2 %» genauso viel wie «40 % statt 60 %», seltene Ereignisse sind also nicht geschenkt. Tipps werden für die Formel auf 0,1 bis 99,9 % begrenzt.

Teilen (Emoji pro Frage: 🎯 Volltreffer, 🟩 ab 65 Punkten, 🟨 ab 45, 🟧 ab 20, 🟥 darunter):

```
Oddle #19 🎯🟩🟨🟩🟥 412/500
Paradox-Freitag · 🔥4
oddle.dicele.io
```

## Themen-Wochentage

| Tag | Thema | Auswahl |
| --- | --- | --- |
| Mo | Würfel-Montag | 2 Würfelfragen + 3 gemischte |
| Di | Karten-Dienstag | 2 Kartenfragen + 3 gemischte |
| Mi | Münz-Mittwoch | 2 Münzfragen + 3 gemischte |
| Do | Alltags-Donnerstag | 2 aus Alltag/Geburtstage + 3 gemischte |
| Fr | Paradox-Freitag | 2 Paradoxe + 3 gemischte |
| Sa | Casino-Samstag | 2 aus Lotto, Roulette, Poker + 3 gemischte |
| So | Boss-Sonntag | 4 gemischte, zum Schluss eine Boss-Frage 👑 |

Der Tagesplan entsteht deterministisch aus dem Datum (Oddle #1 = 27.11.2026): Es kommen immer die am längsten nicht gespielten Fragen dran, Gleichstand entscheidet ein Hash aus Datum und Frage. Alle spielen dieselben Fragen, Reset um Mitternacht (lokale Zeit). Mit 75 Fragen wiederholt sich eine Frage frühestens nach 9 Tagen.

## Progression

- **Ränge** nach Gesamtpunkten: Münzwerfer → Würfelroller (500) → Kartenzähler (1500) → Buchmacher (4000) → Statistiker (8000) → Orakel (15 000)
- **Abzeichen:** 🔥 7-Tage-Streak, 🎯 10 Volltreffer, 🌀 Paradox-Jäger (5 Paradoxe mit 80+ Punkten), 🏆 Perfekte Woche (7 Tage in Folge je 400+)
- **Streak** und bester Streak, Ø Punkte pro Tag
- **Einstellungen:** Ton, Vibration (bei jedem 10-%-Schritt), Experten-Modus (Regler ohne Zahl und Raster)

## Fragen

75 handkuratierte Fragen in 7 Kategorien: Würfel 13, Karten 13, Münzen 9, Geburtstage 8, Lotto & Casino 8, Alltag 13, Paradox 11. Davon sind 7 als Boss-Fragen markiert.

Jede Frage speichert die **exakte Lösung als Bruch** und eine **Simulationsfunktion**. Quelle ist `tools/build_questions.py`; dort werden die Brüche mit `fractions.Fraction` berechnet (Abzählen, Ein- und Ausschluss, dynamische Programmierung für Serien und Nachbarkarten). Das Skript schreibt `js/questions.js`:

```bash
python tools/build_questions.py
```

Eine Simulation ist ein JavaScript-Funktionsrumpf, der pro Versuch `true` oder `false` liefert, oder `null`, wenn die Bedingung der Frage nicht erfüllt ist (bedingte Wahrscheinlichkeiten wie beim Dienstagsjungen). Verfügbare Helfer: `rnd`, `int(n)`, `die()`, `coin()`, `perm(n)`, `sample(n,k)`, `hand(k)`, `rank(c)`, `suit(c)`, `distinct(arr)`, `counts(arr,f)`.

**Prüfung:** `tools/check.html` im Browser öffnen (über den lokalen Server). Die Seite lässt jede Simulation 200 000-mal laufen und vergleicht sie mit dem exakten Wert (z-Wert, Grenze 4,5) und prüft, dass Bruch und Kommazahl zusammenpassen.

## Technik

- Vanilla JavaScript ohne Abhängigkeiten, Fragen als JSON in `js/questions.js`
- Simulation im Web Worker (`js/sim-worker.js` + `js/sim.js`), Rückfall im Hauptthread
- Histogramm auf Canvas, Sounds mit WebAudio (Chiptune), Vibration über `navigator.vibrate`
- Spielstand im `localStorage` (`oddle:v1`), kein Server, keine Anmeldung, kein Echtgeld, keine Werbung
- GitHub Pages mit eigener Subdomain (`CNAME`: `oddle.dicele.io`)
- Farben Petrol und Orange, Titel in Bungee, Text in Rubik

## Dateien

```
index.html            Gerüst
css/style.css         Gestaltung
js/app.js             Spiel: Tagesplan, Regler, Wertung, Histogramm, Teilen, Statistik
js/sim.js             Simulationskern (Worker, Hauptthread, Prüfseite)
js/sim-worker.js      Web Worker
js/questions.js       erzeugter Fragenkatalog
tools/build_questions.py  Fragen + exakte Brüche
tools/check.html      Simulation gegen exakte Lösung
```

## Roadmap

- Kalibrierungsdiagramm («Du überschätzt seltene Ereignisse») und Sammelalbum der Paradoxe
- Archiv vergangener Tage zum Üben (ohne Wertung)
- Fragenpool auf 400+ ausbauen, Generator für Varianten (andere Würfelzahl, Gruppengrösse)
- Schulmodus: Lehrkräfte teilen einen Link mit eigener Fragenliste
