"""Erzeugt js/questions.js aus dem Fragenkatalog.

Jede Frage hat eine exakte Lösung als Bruch (hier mit Fraction berechnet)
und eine Simulationsfunktion in JavaScript (Feld "sim"). tools/check.html
lässt beide gegeneinander laufen.

    python tools/build_questions.py
"""
import json
import math
from fractions import Fraction as F
from functools import lru_cache
from itertools import product
from pathlib import Path

C = math.comb


def D(n):
    """Anzahl fixpunktfreier Permutationen (Derangements)."""
    d = [1, 0]
    for k in range(2, n + 1):
        d.append((k - 1) * (d[-1] + d[-2]))
    return d[n]


def enum_dice(n, pred, faces=6):
    hits = sum(1 for r in product(range(1, faces + 1), repeat=n) if pred(r))
    return F(hits, faces ** n)


def birthday(n, days=365):
    p = F(1)
    for i in range(n):
        p *= F(days - i, days)
    return 1 - p


def no_heads_run(n, k):
    """Anteil der Münzfolgen der Länge n ohne k-mal Kopf in Folge."""
    dp = [1] + [0] * (k - 1)          # dp[r] = Folgen mit aktueller Kopfserie r
    for _ in range(n):
        new = [0] * k
        new[0] = sum(dp)              # Zahl
        for r in range(k - 1):
            new[r + 1] += dp[r]       # Kopf verlängert die Serie
        dp = new
    return F(sum(dp), 2 ** n)


def no_same_run(n, k):
    """Anteil der Münzfolgen der Länge n ohne k gleiche in Folge."""
    dp = [0] * (k + 1)
    dp[1] = 2
    for _ in range(n - 1):
        new = [0] * (k + 1)
        new[1] = sum(dp)              # Wechsel
        for r in range(1, k - 1):
            new[r + 1] += dp[r]       # gleiche Seite
        dp = new
    return F(sum(dp), 2 ** n)


def no_adjacent_ranks():
    """Anteil gemischter 52er-Decks ohne zwei gleichwertige Nachbarn."""
    @lru_cache(maxsize=None)
    def f(n1, n2, n3, n4, last):
        n = [0, n1, n2, n3, n4]
        if n1 + n2 + n3 + n4 == 0:
            return 1
        total = 0
        for g in range(1, 5):
            choices = n[g] - (1 if g == last else 0)
            if choices <= 0:
                continue
            m = n[:]
            m[g] -= 1
            if g > 1:
                m[g - 1] += 1
            total += choices * f(m[1], m[2], m[3], m[4], g - 1)
        return total

    words = f(0, 0, 0, 13, 0)
    all_words = math.factorial(52) // math.factorial(4) ** 13
    return F(words, all_words)


def binom_tail(n, p, lo, hi):
    return sum(F(C(n, k)) * p ** k * (1 - p) ** (n - k) for k in range(lo, hi + 1))


def surjections(n, k):
    return sum((-1) ** j * C(k, j) * (k - j) ** n for j in range(k + 1))


LOTTO = C(49, 6)
POKER = C(52, 5)
BRIDGE = C(52, 13)

Q = []


def q(id, cat, text, how, sim, exact, scene, boss=False, casino=False):
    Q.append(dict(id=id, cat=cat, q=text, how=how, sim=sim.strip(), exact=F(exact),
                  scene=scene, boss=boss, casino=casino))


# ---------------------------------------------------------------- Würfel
q("w-pasch3", "wuerfel",
  "Du wirfst drei Würfel. Wie wahrscheinlich zeigen mindestens zwei davon dieselbe Zahl?",
  "Leichter über das Gegenteil: Alle drei verschieden geht auf 6 · 5 · 4 = 120 von 216 Arten. Also 1 − 120/216 = 4/9 ≈ 44,4 %.",
  "const a=die(),b=die(),c=die(); return a===b||b===c||a===c;",
  enum_dice(3, lambda r: len(set(r)) < 3), {"t": "dice", "n": 3})

q("w-demere", "wuerfel",
  "Du würfelst viermal mit einem Würfel. Wie wahrscheinlich ist mindestens eine Sechs dabei?",
  "Keine Sechs in vier Würfen: (5/6)⁴ = 625/1296. Also 671/1296 ≈ 51,8 %. Mit genau dieser Wette verdiente der Chevalier de Méré im 17. Jahrhundert Geld.",
  "for(let i=0;i<4;i++) if(die()===6) return true; return false;",
  1 - F(5, 6) ** 4, {"t": "dice", "n": 4})

q("w-demere2", "wuerfel",
  "Du wirfst 24-mal zwei Würfel. Wie wahrscheinlich kommt mindestens einmal eine Doppelsechs?",
  "Eine Doppelsechs hat 1/36. Keine in 24 Würfen: (35/36)²⁴ ≈ 50,9 %. Es bleiben nur ≈ 49,1 % – knapp unter der Hälfte. Diese Wette kostete de Méré Geld.",
  "for(let i=0;i<24;i++){ const a=die(),b=die(); if(a===6&&b===6) return true; } return false;",
  1 - F(35, 36) ** 24, {"t": "dice", "n": 2})

q("w-sum7", "wuerfel",
  "Zwei Würfel: Wie wahrscheinlich ist die Augensumme genau 7?",
  "Sechs der 36 Kombinationen ergeben 7: 1+6, 2+5, 3+4 und umgekehrt. 6/36 = 1/6 – die 7 ist die häufigste Summe.",
  "return die()+die()===7;",
  enum_dice(2, lambda r: sum(r) == 7), {"t": "dice", "n": 2})

q("w-five-diff", "wuerfel",
  "Fünf Würfel auf einmal: Wie wahrscheinlich zeigen alle fünf verschiedene Zahlen?",
  "Der erste Würfel darf alles, danach bleiben 5, 4, 3 und 2 freie Zahlen: 6 · 5 · 4 · 3 · 2 = 720 von 6⁵ = 7776 Würfen, also 5/54 ≈ 9,3 %.",
  "return distinct([die(),die(),die(),die(),die()]);",
  enum_dice(5, lambda r: len(set(r)) == 5), {"t": "dice", "n": 5})

q("w-sum13", "wuerfel",
  "Drei Würfel: Wie wahrscheinlich ist die Augensumme 13 oder mehr?",
  "Abzählen von oben: Summe 18 geht auf 1 Art, 17 auf 3, 16 auf 6, 15 auf 10, 14 auf 15, 13 auf 21. Zusammen 56 von 216 = 7/27 ≈ 25,9 %.",
  "return die()+die()+die()>=13;",
  enum_dice(3, lambda r: sum(r) >= 13), {"t": "dice", "n": 3})

q("w-prod-even", "wuerfel",
  "Die Augenzahlen zweier Würfel werden multipliziert. Wie wahrscheinlich ist das Produkt gerade?",
  "Ungerade wird das Produkt nur, wenn beide Würfel ungerade sind: 1/2 · 1/2 = 1/4. Also gerade mit 3/4.",
  "return (die()*die())%2===0;",
  enum_dice(2, lambda r: (r[0] * r[1]) % 2 == 0), {"t": "dice", "n": 2})

q("w-four-diff", "wuerfel",
  "Vier Würfel: Wie wahrscheinlich sind alle vier Augenzahlen verschieden?",
  "6 · 5 · 4 · 3 = 360 der 6⁴ = 1296 Würfe haben lauter verschiedene Zahlen. Das sind 5/18 ≈ 27,8 %.",
  "return distinct([die(),die(),die(),die()]);",
  enum_dice(4, lambda r: len(set(r)) == 4), {"t": "dice", "n": 4})

q("w-wait6", "wuerfel",
  "Du würfelst, bis die erste Sechs kommt. Wie wahrscheinlich brauchst du mehr als sechs Würfe?",
  "Mehr als sechs Würfe heisst: In den ersten sechs kam keine Sechs. (5/6)⁶ ≈ 33,5 % – jeder Dritte wartet länger, als das Bauchgefühl meint.",
  "for(let i=0;i<6;i++) if(die()===6) return false; return true;",
  F(5, 6) ** 6, {"t": "dice", "n": 1})

q("w-sum10", "wuerfel",
  "Drei Würfel: Wie wahrscheinlich ist die Augensumme genau 10?",
  "27 der 216 Kombinationen ergeben 10 (zum Beispiel 1+3+6 in sechs Reihenfolgen). 27/216 = 1/8 = 12,5 %.",
  "return die()+die()+die()===10;",
  enum_dice(3, lambda r: sum(r) == 10), {"t": "dice", "n": 3})

q("w-ten-no6", "wuerfel",
  "Zehn Würfel auf einmal. Wie wahrscheinlich ist keine einzige Sechs dabei?",
  "Jeder Würfel verfehlt die Sechs mit 5/6, unabhängig voneinander: (5/6)¹⁰ ≈ 16,2 %.",
  "for(let i=0;i<10;i++) if(die()===6) return false; return true;",
  F(5, 6) ** 10, {"t": "dice", "n": 10})

q("w-diff2", "wuerfel",
  "Zwei Würfel: Wie wahrscheinlich unterscheiden sich die Augenzahlen um genau 2?",
  "Abstand 2 haben (1,3), (2,4), (3,5) und (4,6), jeweils in beiden Reihenfolgen. Das sind 8 von 36, also 2/9 ≈ 22,2 %.",
  "return Math.abs(die()-die())===2;",
  enum_dice(2, lambda r: abs(r[0] - r[1]) == 2), {"t": "dice", "n": 2})

q("w-six-all", "wuerfel",
  "Sechs Würfel auf einmal: Wie wahrscheinlich kommt jede Zahl von 1 bis 6 genau einmal vor?",
  "Es gibt 6! = 720 passende Reihenfolgen unter 6⁶ = 46 656 Würfen. Das sind 5/324 ≈ 1,5 %.",
  "return distinct([die(),die(),die(),die(),die(),die()]);",
  F(math.factorial(6), 6 ** 6), {"t": "dice", "n": 6})

# ---------------------------------------------------------------- Karten
q("k-two-aces", "karten",
  "Aus einem gemischten 52er-Kartenspiel ziehst du zwei Karten. Wie wahrscheinlich sind beide Asse?",
  "Erste Karte Ass: 4/52, zweite dann noch 3/51. 4/52 · 3/51 = 1/221 ≈ 0,45 %.",
  "const h=hand(2); return rank(h[0])===0&&rank(h[1])===0;",
  F(4, 52) * F(3, 51), {"t": "cards", "n": 2})

q("k-pair5", "karten",
  "Du ziehst fünf Karten. Wie wahrscheinlich haben mindestens zwei davon denselben Wert (z. B. zwei Könige)?",
  "Gegenteil: fünf verschiedene Werte. C(13,5) Wertekombinationen mal 4⁵ Farben ergibt 1 317 888 von 2 598 960 Händen. Bleiben ≈ 49,3 % mit mindestens einem Paar.",
  "return !distinct(hand(5).map(rank));",
  1 - F(C(13, 5) * 4 ** 5, POKER), {"t": "cards", "n": 5}, casino=True)

q("k-four-suit", "karten",
  "Du ziehst fünf Karten. Wie wahrscheinlich sind mindestens vier davon in derselben Farbe (z. B. vier Herz)?",
  "Genau vier einer Farbe: 4 · C(13,4) · 39 = 111 540 Hände, alle fünf einer Farbe: 4 · C(13,5) = 5148. Zusammen 116 688 von 2 598 960 ≈ 4,5 %.",
  "return counts(hand(5),suit)[0]>=4;",
  F(4 * C(13, 4) * 39 + 4 * C(13, 5), POKER), {"t": "cards", "n": 5}, casino=True)

q("k-heart-ace", "karten",
  "Du deckst die oberste Karte eines gemischten Spiels auf. Wie wahrscheinlich ist sie ein Herz oder ein Ass?",
  "13 Herzen plus 4 Asse, aber das Herz-Ass ist doppelt gezählt: 13 + 4 − 1 = 16 von 52 Karten, also 4/13 ≈ 30,8 %.",
  "const c=int(52); return suit(c)===0||rank(c)===0;",
  F(16, 52), {"t": "cards", "n": 1})

q("k-same-suit", "karten",
  "Du ziehst zwei Karten. Wie wahrscheinlich haben beide dieselbe Farbe (Herz, Karo, Pik oder Kreuz)?",
  "Die erste Karte ist egal. Von den 51 übrigen haben noch 12 ihre Farbe: 12/51 = 4/17 ≈ 23,5 %.",
  "const h=hand(2); return suit(h[0])===suit(h[1]);",
  F(12, 51), {"t": "cards", "n": 2})

q("k-no-ace13", "karten",
  "Du bekommst 13 Karten aus einem 52er-Spiel. Wie wahrscheinlich ist kein einziges Ass dabei?",
  "Alle 13 Karten müssen aus den 48 Nicht-Assen kommen: C(48,13)/C(52,13) ≈ 30,4 %.",
  "return hand(13).every(c=>rank(c)!==0);",
  F(C(48, 13), BRIDGE), {"t": "cards", "n": 7})

q("k-void", "karten",
  "Du bekommst 13 Karten aus einem 52er-Spiel. Wie wahrscheinlich fehlt dir mindestens eine Farbe komplett?",
  "Ein- und Ausschluss: 4 · C(39,13) Hände ohne eine bestimmte Farbe, minus 6 · C(26,13) doppelt gezählte ohne zwei Farben, plus 4 · C(13,13). Geteilt durch C(52,13) ergibt ≈ 5,1 %.",
  "const s=[0,0,0,0]; for(const c of hand(13)) s[suit(c)]++; return s.indexOf(0)>=0;",
  F(4 * C(39, 13) - 6 * C(26, 13) + 4 * C(13, 13), BRIDGE), {"t": "cards", "n": 7}, boss=True)

q("k-adjacent", "karten",
  "Du mischst ein 52er-Spiel gründlich. Wie wahrscheinlich liegen irgendwo zwei gleichwertige Karten (z. B. zwei Damen) direkt nebeneinander?",
  "Jedes der 51 Nachbarpaare ist mit 3/51 = 1/17 gleichwertig, im Schnitt gibt es also drei solche Paare pro Mischung. Die exakte Zählung aller Anordnungen lässt nur ≈ 4,5 % ohne ein einziges Paar übrig.",
  "const p=perm(52); for(let i=1;i<52;i++) if(p[i]%13===p[i-1]%13) return true; return false;",
  1 - no_adjacent_ranks(), {"t": "cards", "n": 7}, boss=True)

q("k-fixed", "karten",
  "Zwei 52er-Spiele werden gemischt und gleichzeitig Karte für Karte aufgedeckt. Wie wahrscheinlich ist mindestens einmal dieselbe Karte oben?",
  "Das Rencontre-Problem: Die Chance, dass nie etwas übereinstimmt, ist praktisch 1/e ≈ 36,8 %. Also ≈ 63,2 % – fast unabhängig davon, ob mit 10 oder 52 Karten gespielt wird.",
  "const p=perm(52); for(let i=0;i<52;i++) if(p[i]===i) return true; return false;",
  1 - F(D(52), math.factorial(52)), {"t": "cards", "n": 2})

q("k-face3", "karten",
  "Du ziehst drei Karten. Wie wahrscheinlich ist mindestens ein Bube, eine Dame oder ein König dabei?",
  "Gegenteil: alle drei aus den 40 Karten ohne Bild. C(40,3)/C(52,3) = 9880/22 100 ≈ 44,7 %. Also ≈ 55,3 % mit Bild.",
  "return hand(3).some(c=>rank(c)>=10);",
  1 - F(C(40, 3), C(52, 3)), {"t": "cards", "n": 3})

q("k-first-ace", "karten",
  "Du deckst ein gemischtes Spiel von oben auf. Wie wahrscheinlich ist unter den ersten zehn Karten noch kein Ass?",
  "Die zehn Karten müssen alle aus den 48 Nicht-Assen stammen: C(48,10)/C(52,10) ≈ 41,3 %.",
  "const p=perm(52); for(let i=0;i<10;i++) if(rank(p[i])===0) return false; return true;",
  F(C(48, 10), C(52, 10)), {"t": "cards", "n": 5})

q("k-two-pair", "karten",
  "Poker mit fünf Karten: Wie wahrscheinlich hältst du genau zwei Paare?",
  "Zwei Werte für die Paare: C(13,2) = 78, je C(4,2) = 6 Farben, dazu eine fünfte Karte aus 44: 78 · 36 · 44 = 123 552 von 2 598 960 ≈ 4,75 %.",
  "const c=counts(hand(5),rank); return c[0]===2&&c[1]===2;",
  F(C(13, 2) * 36 * 44, POKER), {"t": "cards", "n": 5}, casino=True)

q("k-trips", "karten",
  "Poker mit fünf Karten: Wie wahrscheinlich hältst du genau einen Drilling (drei Gleiche, sonst nichts)?",
  "13 Werte mal C(4,3) = 4 Farben, dazu zwei verschiedene andere Werte: C(12,2) · 4 · 4. Zusammen 54 912 von 2 598 960 ≈ 2,1 %.",
  "const c=counts(hand(5),rank); return c[0]===3&&c[1]===1;",
  F(13 * 4 * C(12, 2) * 16, POKER), {"t": "cards", "n": 5}, casino=True)

# ---------------------------------------------------------------- Münzen
q("m-five-of-ten", "muenzen",
  "Du wirfst eine Münze zehnmal. Wie wahrscheinlich kommt genau fünfmal Kopf?",
  "C(10,5) = 252 der 1024 Abfolgen haben genau fünf Kopf, also ≈ 24,6 %. Das «ausgeglichene» Ergebnis ist keineswegs der Normalfall.",
  "let k=0; for(let i=0;i<10;i++) if(coin()) k++; return k===5;",
  F(C(10, 5), 2 ** 10), {"t": "coins", "n": 10})

q("m-run4", "muenzen",
  "Zehn Münzwürfe: Wie wahrscheinlich kommt irgendwo mindestens viermal Kopf in Folge?",
  "Man zählt die Folgen ohne vier Kopf am Stück Schritt für Schritt (nach Länge der aktuellen Kopfserie): 773 von 1024. Bleiben 251/1024 ≈ 24,5 %.",
  "let r=0; for(let i=0;i<10;i++){ if(coin()){ if(++r>=4) return true; } else r=0; } return false;",
  1 - no_heads_run(10, 4), {"t": "coins", "n": 10})

q("m-run5any", "muenzen",
  "Zwanzig Münzwürfe: Wie wahrscheinlich gibt es irgendwo fünf gleiche Seiten in Folge (Kopf oder Zahl)?",
  "Folgen ohne Fünferserie lassen sich wie Fibonacci-Zahlen aufbauen: Jede neue Serie ist 1 bis 4 lang. Das ergibt ≈ 54 % ohne Serie, also ≈ 46 % mit – lange Serien sind viel häufiger, als man denkt.",
  "let prev=-1,r=0; for(let i=0;i<20;i++){ const c=coin()?1:0; r=(c===prev)?r+1:1; prev=c; if(r>=5) return true; } return false;",
  1 - no_same_run(20, 5), {"t": "coins", "n": 10}, boss=True)

q("m-three-same", "muenzen",
  "Drei Münzen: Wie wahrscheinlich zeigen alle dieselbe Seite?",
  "KKK oder ZZZ: 2 von 8 gleich wahrscheinlichen Ausgängen, also 1/4. Der beliebte Schluss «zwei sind sowieso gleich, die dritte passt mit 1/2» ist falsch.",
  "const a=coin(),b=coin(),c=coin(); return a===b&&b===c;",
  F(2, 8), {"t": "coins", "n": 3})

q("m-100", "muenzen",
  "100 Münzwürfe: Wie wahrscheinlich liegt die Zahl der Köpfe zwischen 45 und 55 (beide eingeschlossen)?",
  "Man summiert C(100,k)/2¹⁰⁰ für k = 45 bis 55. Die Standardabweichung ist 5, das Fenster ist also gut ±1 Standardabweichung breit: ≈ 72,9 %.",
  "let k=0; for(let i=0;i<100;i++) if(coin()) k++; return k>=45&&k<=55;",
  binom_tail(100, F(1, 2), 45, 55), {"t": "coins", "n": 10})

q("m-more-heads6", "muenzen",
  "Sechs Münzwürfe: Wie wahrscheinlich kommt öfter Kopf als Zahl?",
  "4, 5 oder 6 Kopf: 15 + 6 + 1 = 22 von 64 Abfolgen ≈ 34,4 %. Nicht 50 %, weil das Unentschieden 3:3 mit 20/64 dazwischenliegt.",
  "let k=0; for(let i=0;i<6;i++) if(coin()) k++; return k>3;",
  F(22, 64), {"t": "coins", "n": 6})

q("m-even", "muenzen",
  "Du wirfst eine Münze, bis zum ersten Mal Kopf kommt. Wie wahrscheinlich brauchst du dafür eine gerade Anzahl Würfe?",
  "Ungerade liegt in jedem Paar doppelt vorne: 1/2 gegen 1/4, dann 1/8 gegen 1/16 und so weiter. Gerade bekommt also 1/3, ungerade 2/3.",
  "let n=1; while(!coin()) n++; return n%2===0;",
  F(1, 3), {"t": "coins", "n": 1})

q("m-alt", "muenzen",
  "Fünf Münzwürfe: Wie wahrscheinlich wechseln sich Kopf und Zahl perfekt ab (KZKZK oder ZKZKZ)?",
  "Nur 2 der 32 möglichen Abfolgen wechseln jedes Mal: 2/32 = 1/16 = 6,25 %.",
  "let prev=coin(); for(let i=1;i<5;i++){ const c=coin(); if(c===prev) return false; prev=c; } return true;",
  F(2, 32), {"t": "coins", "n": 5})

q("m-same-heads", "muenzen",
  "Zwei Leute werfen je drei Münzen. Wie wahrscheinlich haben beide gleich oft Kopf?",
  "Für 0, 1, 2 oder 3 Kopf gibt es 1, 3, 3 und 1 Abfolge. Gleich oft: (1² + 3² + 3² + 1²)/64 = 20/64 = 5/16 ≈ 31,3 %.",
  "let a=0,b=0; for(let i=0;i<3;i++){ if(coin()) a++; if(coin()) b++; } return a===b;",
  F(20, 64), {"t": "coins", "n": 6})

# ---------------------------------------------------------------- Geburtstage
BDAY = "(365 Tage, alle gleich wahrscheinlich)"


def bday_sim(n):
    return f"const s=new Uint8Array(365); for(let i=0;i<{n};i++){{ const d=int(365); if(s[d]) return true; s[d]=1; }} return false;"


q("g-23", "geburtstag",
  f"In einem Raum sind 23 Personen. Wie wahrscheinlich haben mindestens zwei am selben Tag Geburtstag? {BDAY}",
  "Alle verschieden: 365/365 · 364/365 · … · 343/365 ≈ 49,3 %. Also ≈ 50,7 % für ein gemeinsames Datum – denn 23 Leute bilden schon 253 Paare.",
  bday_sim(23), birthday(23), {"t": "people", "n": 23})

q("g-30", "geburtstag",
  f"Eine Schulklasse mit 30 Kindern. Wie wahrscheinlich haben zwei am selben Tag Geburtstag? {BDAY}",
  "Wahrscheinlichkeit für lauter verschiedene Daten: das Produkt (365 − i)/365 für i = 0 bis 29 ≈ 29,4 %. Also ≈ 70,6 %.",
  bday_sim(30), birthday(30), {"t": "people", "n": 30})

q("g-10", "geburtstag",
  f"Zehn Leute sitzen am Tisch. Wie wahrscheinlich haben zwei am selben Tag Geburtstag? {BDAY}",
  "Lauter verschiedene Daten: 365 · 364 · … · 356 / 365¹⁰ ≈ 88,3 %. Bleiben ≈ 11,7 %.",
  bday_sim(10), birthday(10), {"t": "people", "n": 10})

q("g-you", "geburtstag",
  f"Du bist mit 22 anderen in einem Raum. Wie wahrscheinlich hat jemand am selben Tag Geburtstag wie du? {BDAY}",
  "Jetzt zählt nur dein Datum: Jede der 22 Personen verfehlt es mit 364/365. 1 − (364/365)²² ≈ 5,9 % – fast zehnmal weniger als beim klassischen Geburtstagsparadox.",
  "const me=int(365); for(let i=0;i<22;i++) if(int(365)===me) return true; return false;",
  1 - F(364, 365) ** 22, {"t": "people", "n": 23})

q("g-50", "geburtstag",
  f"Eine Party mit 50 Gästen. Wie wahrscheinlich haben zwei am selben Tag Geburtstag? {BDAY}",
  "50 Gäste bilden 1225 Paare. Lauter verschiedene Daten gibt es nur noch mit ≈ 3,0 %, also ≈ 97,0 % für mindestens ein gemeinsames Datum.",
  bday_sim(50), birthday(50), {"t": "people", "n": 30})

q("g-months", "geburtstag",
  "Vier Freundinnen: Wie wahrscheinlich sind alle in verschiedenen Monaten geboren? (12 gleich wahrscheinliche Monate)",
  "12 · 11 · 10 · 9 = 11 880 von 12⁴ = 20 736 Möglichkeiten: 55/96 ≈ 57,3 %.",
  "return distinct([int(12),int(12),int(12),int(12)]);",
  F(12 * 11 * 10 * 9, 12 ** 4), {"t": "people", "n": 4})

q("g-weekday", "geburtstag",
  "Sieben Leute: Wie wahrscheinlich ist jede an einem anderen Wochentag geboren?",
  "7! = 5040 passende Verteilungen unter 7⁷ = 823 543. Das sind nur ≈ 0,61 %.",
  "return distinct([int(7),int(7),int(7),int(7),int(7),int(7),int(7)]);",
  F(math.factorial(7), 7 ** 7), {"t": "people", "n": 7})

q("g-dec", "geburtstag",
  "Fünf Leute: Wie wahrscheinlich hat mindestens eine Person im Dezember Geburtstag? (12 gleich wahrscheinliche Monate)",
  "Niemand im Dezember: (11/12)⁵ ≈ 64,7 %. Also ≈ 35,3 %.",
  "for(let i=0;i<5;i++) if(int(12)===11) return true; return false;",
  1 - F(11, 12) ** 5, {"t": "people", "n": 5})

# ---------------------------------------------------------------- Lotto & Casino
LSIM = "const t=sample(49,6),z=sample(49,6); let k=0; for(const x of t) if(z.includes(x)) k++; "

q("l-three", "casino",
  "Lotto 6 aus 49: Du tippst sechs Zahlen. Wie wahrscheinlich hast du mindestens drei Richtige?",
  "Genau k Richtige: C(6,k) · C(43,6−k) / C(49,6). Für k = 3 bis 6 zusammen 260 624 von 13 983 816 Ziehungen ≈ 1,9 %.",
  LSIM + "return k>=3;",
  F(sum(C(6, k) * C(43, 6 - k) for k in range(3, 7)), LOTTO), {"t": "lotto", "n": 6})

q("l-neighbors", "casino",
  "Lotto 6 aus 49: Wie wahrscheinlich sind unter den sechs gezogenen Zahlen zwei direkte Nachbarn (z. B. 17 und 18)?",
  "Schiebt man die Lücken zusammen, entspricht jede Ziehung ohne Nachbarn genau einer Wahl von sechs Zahlen aus 44. 1 − C(44,6)/C(49,6) ≈ 49,5 % – fast jede zweite Ziehung.",
  "const z=sample(49,6).sort((a,b)=>a-b); for(let i=1;i<6;i++) if(z[i]-z[i-1]===1) return true; return false;",
  1 - F(C(44, 6), LOTTO), {"t": "lotto", "n": 6})

q("l-zero", "casino",
  "Lotto 6 aus 49: Wie wahrscheinlich hast du keine einzige Richtige?",
  "Alle sechs gezogenen Zahlen müssen aus den 43 nicht getippten kommen: C(43,6)/C(49,6) ≈ 43,6 %.",
  LSIM + "return k===0;",
  F(C(43, 6), LOTTO), {"t": "lotto", "n": 6})

q("l-one", "casino",
  "Lotto 6 aus 49: Wie wahrscheinlich hast du genau eine Richtige?",
  "Eine deiner sechs Zahlen und fünf der 43 anderen: 6 · C(43,5)/C(49,6) ≈ 41,3 % – fast so häufig wie gar keine.",
  LSIM + "return k===1;",
  F(6 * C(43, 5), LOTTO), {"t": "lotto", "n": 6})

q("l-low", "casino",
  "Lotto 6 aus 49: Wie wahrscheinlich sind alle sechs gezogenen Zahlen 30 oder kleiner?",
  "Alle sechs aus den Zahlen 1 bis 30: C(30,6)/C(49,6) = 593 775/13 983 816 ≈ 4,2 %.",
  "return sample(49,6).every(x=>x<=30);",
  F(C(30, 6), LOTTO), {"t": "lotto", "n": 6})

q("l-even", "casino",
  "Lotto 6 aus 49: Wie wahrscheinlich sind alle sechs gezogenen Zahlen gerade?",
  "Es gibt 24 gerade Zahlen bis 49: C(24,6)/C(49,6) = 134 596/13 983 816 ≈ 0,96 %.",
  "return sample(49,6).every(x=>x%2===0);",
  F(C(24, 6), LOTTO), {"t": "lotto", "n": 6})

q("c-red5", "casino",
  "Roulette mit 37 Feldern (18 rot, 18 schwarz, die Null grün): Wie wahrscheinlich kommt fünfmal hintereinander Rot?",
  "Jeder Dreh ist mit 18/37 rot, unabhängig vom letzten: (18/37)⁵ ≈ 2,7 %.",
  "for(let i=0;i<5;i++) if(int(37)>=18) return false; return true;",
  F(18, 37) ** 5, {"t": "roulette"})

q("c-zero37", "casino",
  "Roulette mit 37 Feldern: Wie wahrscheinlich fällt in 37 Drehungen mindestens einmal die Null?",
  "Keine Null in 37 Drehungen: (36/37)³⁷ ≈ 36,3 %. Also ≈ 63,7 % – obwohl die Null «im Schnitt einmal» kommen sollte.",
  "for(let i=0;i<37;i++) if(int(37)===0) return true; return false;",
  1 - F(36, 37) ** 37, {"t": "roulette"})

# ---------------------------------------------------------------- Alltag
q("a-socks", "alltag",
  "In der Schublade liegen fünf verschiedene Sockenpaare durcheinander. Du greifst im Dunkeln zwei Socken. Wie wahrscheinlich passen sie zusammen?",
  "Die erste Socke ist egal. Von den neun übrigen passt genau eine: 1/9 ≈ 11,1 %.",
  "const h=sample(10,2); return Math.ceil(h[0]/2)===Math.ceil(h[1]/2);",
  F(1, 9), {"t": "emoji", "i": ["🧦", "🧦", "🧦", "🧦", "🧦"]})

q("a-wichteln", "alltag",
  "Acht Freunde ziehen beim Wichteln Lose mit ihren Namen. Wie wahrscheinlich zieht niemand sich selbst?",
  "Gesucht sind fixpunktfreie Permutationen: 14 833 der 8! = 40 320 Verlosungen. Das sind ≈ 36,8 %, also fast genau 1/e.",
  "const p=perm(8); for(let i=0;i<8;i++) if(p[i]===i) return false; return true;",
  F(D(8), math.factorial(8)), {"t": "emoji", "i": ["🎁", "🎁", "🎁", "🎁", "🎁", "🎁", "🎁", "🎁"]})

q("a-playlist", "alltag",
  "Die Zufallswiedergabe wählt aus 20 Songs zehnmal unabhängig einen Song. Wie wahrscheinlich läuft mindestens ein Song doppelt?",
  "Lauter verschiedene Songs: 20 · 19 · … · 11 / 20¹⁰ ≈ 6,5 %. Also ≈ 93,5 % – das Geburtstagsparadox im Kleinen.",
  "const s=new Uint8Array(20); for(let i=0;i<10;i++){ const x=int(20); if(s[x]) return true; s[x]=1; } return false;",
  1 - F(math.perm(20, 10), 20 ** 10), {"t": "emoji", "i": ["🎵", "🎶", "🎵", "🎶", "🎵"]})

q("a-lift", "alltag",
  "Vier Leute steigen im Erdgeschoss in den Lift. Jede drückt zufällig eines von acht Stockwerken. Wie wahrscheinlich steigen alle in verschiedenen Stockwerken aus?",
  "8 · 7 · 6 · 5 = 1680 von 8⁴ = 4096 Möglichkeiten: 105/256 ≈ 41,0 %.",
  "return distinct([int(8),int(8),int(8),int(8)]);",
  F(8 * 7 * 6 * 5, 8 ** 4), {"t": "emoji", "i": ["🛗", "🧍", "🧍", "🧍", "🧍"]})

q("a-jackets", "alltag",
  "Sechs Gäste bekommen ihre Jacken an der Garderobe völlig zufällig zurück. Wie wahrscheinlich erhalten mindestens zwei ihre eigene Jacke?",
  "Keiner richtig: 265 von 720 Verteilungen, genau einer: 6 · 44 = 264. Bleiben 191/720 ≈ 26,5 % für mindestens zwei.",
  "const p=perm(6); let k=0; for(let i=0;i<6;i++) if(p[i]===i) k++; return k>=2;",
  1 - F(D(6) + 6 * D(5), math.factorial(6)), {"t": "emoji", "i": ["🧥", "🧥", "🧥", "🧥", "🧥", "🧥"]})

q("a-meet", "alltag",
  "Zwei Freunde kommen unabhängig zu einem zufälligen Zeitpunkt zwischen 12 und 13 Uhr ins Café und warten je 15 Minuten. Wie wahrscheinlich treffen sie sich?",
  "Im Quadrat aller Ankunftszeiten fallen zwei Dreiecke weg, in denen sie mehr als 15 Minuten trennt: 1 − (3/4)² = 7/16 ≈ 43,8 %.",
  "return Math.abs(rnd()-rnd())<=0.25;",
  1 - F(3, 4) ** 2, {"t": "emoji", "i": ["☕", "🕛", "☕"]})

q("a-mc", "alltag",
  "Ein Test hat zehn Fragen mit je vier Antworten. Du rätst überall. Wie wahrscheinlich hast du mindestens fünf richtig?",
  "Binomialverteilung mit p = 1/4: Summe von C(10,k) · (1/4)ᵏ · (3/4)¹⁰⁻ᵏ für k = 5 bis 10 ≈ 7,8 %.",
  "let k=0; for(let i=0;i<10;i++) if(int(4)===0) k++; return k>=5;",
  binom_tail(10, F(1, 4), 5, 10), {"t": "emoji", "i": ["📝", "❓", "❓", "❓"]})

q("a-pin", "alltag",
  "Eine vierstellige PIN wird zufällig erzeugt (0000 bis 9999). Wie wahrscheinlich kommt eine Ziffer mehrfach vor?",
  "Lauter verschiedene Ziffern: 10 · 9 · 8 · 7 = 5040 von 10 000. Also 49,6 % mit Wiederholung.",
  "return !distinct([int(10),int(10),int(10),int(10)]);",
  1 - F(5040, 10000), {"t": "emoji", "i": ["🔢", "🔒"]})

q("a-six-start", "alltag",
  "Beim Brettspiel darfst du dreimal würfeln, um mit einer Sechs rauszukommen. Wie wahrscheinlich klappt es?",
  "Dreimal keine Sechs: (5/6)³ = 125/216. Also 91/216 ≈ 42,1 % – weniger als die Hälfte.",
  "for(let i=0;i<3;i++) if(die()===6) return true; return false;",
  1 - F(5, 6) ** 3, {"t": "dice", "n": 1})

q("a-kids", "alltag",
  "Eine Familie hat vier Kinder (Mädchen und Junge je 50 %). Wie wahrscheinlich sind es genau zwei Mädchen und zwei Jungen?",
  "C(4,2) = 6 der 16 Abfolgen sind 2:2, also 37,5 %. Eine 3:1-Verteilung (in beide Richtungen) ist mit 8/16 sogar wahrscheinlicher.",
  "let k=0; for(let i=0;i<4;i++) if(coin()) k++; return k===2;",
  F(C(4, 2), 16), {"t": "emoji", "i": ["👧", "👦", "👧", "👦"]})

q("a-dishes", "alltag",
  "Aus zehn WG-Leuten werden drei zufällig zum Abwasch gelost. Wie wahrscheinlich trifft es dich und deine beste Freundin gemeinsam?",
  "Ihr zwei seid dabei, dazu eine der acht anderen Personen: 8 von C(10,3) = 120 Losungen, also 1/15 ≈ 6,7 %.",
  "const s=sample(10,3); return s.includes(1)&&s.includes(2);",
  F(8, C(10, 3)), {"t": "emoji", "i": ["🍽️", "🧽", "🍽️"]})

q("a-lights", "alltag",
  "Auf deinem Weg liegen fünf Ampeln, jede ist unabhängig mit 40 % grün. Wie wahrscheinlich hast du überall grün?",
  "0,4⁵ = 32/3125 ≈ 1,0 % – eine «grüne Welle» erlebst du ohne Koordination etwa an einem von hundert Tagen.",
  "for(let i=0;i<5;i++) if(rnd()>=0.4) return false; return true;",
  F(2, 5) ** 5, {"t": "emoji", "i": ["🚦", "🚦", "🚦", "🚦", "🚦"]})

q("a-coupons", "alltag",
  "Sammelfiguren: Es gibt sechs verschiedene, jede gleich häufig, eine pro Packung. Wie wahrscheinlich hast du nach zehn Packungen alle sechs?",
  "Gezählt werden Abfolgen, in denen jede Figur vorkommt (Ein- und Ausschluss): 16 435 440 von 6¹⁰ ≈ 27,2 %. Im Schnitt braucht man 14,7 Packungen.",
  "const s=new Uint8Array(6); let n=0; for(let i=0;i<10;i++){ const f=int(6); if(!s[f]){ s[f]=1; n++; } } return n===6;",
  F(surjections(10, 6), 6 ** 10), {"t": "emoji", "i": ["📦", "🦖", "🦄", "🐙", "🦊", "🐢", "🐝"]}, boss=True)

# ---------------------------------------------------------------- Paradox
q("p-monty", "paradox",
  "Drei Türen, hinter einer steht ein Auto. Du wählst Tür 1, der Moderator öffnet eine andere Tür mit einer Ziege. Du wechselst. Wie wahrscheinlich gewinnst du das Auto?",
  "Deine erste Wahl trifft nur mit 1/3. In den anderen 2/3 der Fälle zeigt dir der Moderator, welche der zwei übrigen Türen das Auto hat. Wechseln gewinnt mit 2/3.",
  "const car=int(3); const opts=[1,2].filter(d=>d!==car); const open=opts[int(opts.length)]; const other=open===1?2:1; return other===car;",
  F(2, 3), {"t": "emoji", "i": ["🚪", "🚪", "🐐"]})

q("p-boygirl", "paradox",
  "Eine Familie hat zwei Kinder, mindestens eines ist ein Junge. Wie wahrscheinlich sind beide Jungen?",
  "Gleich wahrscheinlich sind JJ, JM, MJ und MM. Die Information streicht nur MM. Von den drei übrigen ist eine JJ: 1/3.",
  "const a=coin(),b=coin(); if(!a&&!b) return null; return a&&b;",
  F(1, 3), {"t": "emoji", "i": ["👦", "❔"]})

q("p-tuesday", "paradox",
  "Eine Familie hat zwei Kinder. Mindestens eines ist ein Junge, der an einem Dienstag geboren wurde. Wie wahrscheinlich sind beide Jungen?",
  "Von 14 × 14 = 196 gleich wahrscheinlichen (Geschlecht, Wochentag)-Paaren enthalten 27 einen Dienstagsjungen, 13 davon sind zwei Jungen. Also 13/27 ≈ 48,1 % – der Wochentag ändert die Antwort.",
  "const a=coin(),b=coin(),da=int(7),db=int(7); if(!((a&&da===1)||(b&&db===1))) return null; return a&&b;",
  F(13, 27), {"t": "emoji", "i": ["👦", "📅", "❔"]}, boss=True)

q("p-box", "paradox",
  "Drei Karten: eine beidseitig rot, eine beidseitig weiss, eine rot und weiss. Du ziehst blind eine und siehst oben Rot. Wie wahrscheinlich ist auch die Unterseite rot?",
  "Es gibt drei rote Seiten, die du sehen könntest. Zwei davon gehören zur rot-roten Karte. Also 2/3, nicht 1/2.",
  "const cards=[[1,1],[0,0],[1,0]]; const c=cards[int(3)], s=int(2); if(c[s]!==1) return null; return c[1-s]===1;",
  F(2, 3), {"t": "emoji", "i": ["🟥", "⬜", "🔳"]})

q("p-efron", "paradox",
  "Würfel A hat die Seiten 2, 2, 4, 4, 9, 9, Würfel B die Seiten 1, 1, 6, 6, 8, 8. Beide werden geworfen. Wie wahrscheinlich zeigt A die höhere Zahl?",
  "A = 2 oder 4 schlägt nur die 1 (je 1/3), A = 9 schlägt alles: (1/3 + 1/3 + 1)/3 = 5/9. Verblüffend: Ein dritter Würfel mit 3, 3, 5, 5, 7, 7 schlägt A und verliert gegen B.",
  "const A=[2,2,4,4,9,9],B=[1,1,6,6,8,8]; return A[int(6)]>B[int(6)];",
  F(sum(1 for a in [2, 2, 4, 4, 9, 9] for b in [1, 1, 6, 6, 8, 8] if a > b), 36), {"t": "dice", "n": 2})

q("p-test", "paradox",
  "Eine Krankheit hat 1 von 100 Menschen. Ein Test erkennt sie in 99 % der Fälle, schlägt aber auch bei 5 % der Gesunden an. Dein Test ist positiv. Wie wahrscheinlich bist du krank?",
  "Von 10 000 Leuten sind 100 krank, 99 davon positiv. Von den 9900 Gesunden sind 495 falsch positiv. 99/(99 + 495) = 1/6 ≈ 16,7 %.",
  "const sick=rnd()<0.01; const pos=sick?rnd()<0.99:rnd()<0.05; if(!pos) return null; return sick;",
  F(99, 99 + 495), {"t": "emoji", "i": ["🧪", "➕"]})

q("p-double6", "paradox",
  "Zwei Würfel, jemand verrät dir: Mindestens einer zeigt eine Sechs. Wie wahrscheinlich ist es eine Doppelsechs?",
  "11 der 36 Würfe enthalten eine Sechs, nur einer davon ist (6,6). Also 1/11 ≈ 9,1 %, nicht 1/6.",
  "const a=die(),b=die(); if(a!==6&&b!==6) return null; return a===6&&b===6;",
  F(1, 11), {"t": "dice", "n": 2})

q("p-prisoners", "paradox",
  "100 Gefangene, 100 Kisten mit ihren Nummern in zufälliger Ordnung. Jeder darf 50 Kisten öffnen. Alle überleben nur, wenn jeder seine Nummer findet. Mit der Schleifen-Strategie (erst die eigene Kistennummer, dann immer die gefundene Nummer): Wie wahrscheinlich gewinnen sie?",
  "Die Strategie gewinnt genau dann, wenn die Zufallsanordnung keinen Zyklus länger als 50 hat. Das passiert mit 1 − (1/51 + 1/52 + … + 1/100) ≈ 31,2 % – statt (1/2)¹⁰⁰ beim blinden Raten.",
  "const p=perm(100), seen=new Uint8Array(100); for(let i=0;i<100;i++){ if(seen[i]) continue; let len=0,j=i; while(!seen[j]){ seen[j]=1; j=p[j]; len++; } if(len>50) return false; } return true;",
  1 - sum(F(1, k) for k in range(51, 101)), {"t": "emoji", "i": ["📦", "📦", "📦", "🔢", "📦", "📦"]}, boss=True)

q("p-stick", "paradox",
  "Ein Stab wird an zwei zufälligen Stellen gebrochen. Wie wahrscheinlich lässt sich aus den drei Stücken ein Dreieck legen?",
  "Ein Dreieck geht genau dann, wenn kein Stück länger als die halbe Länge ist. Im Quadrat aller möglichen Bruchstellen-Paare ist das ein Gebiet mit Fläche 1/4.",
  "const a=rnd(),b=rnd(); const x=Math.min(a,b),y=Math.max(a,b); return x<0.5&&y-x<0.5&&1-y<0.5;",
  F(1, 4), {"t": "emoji", "i": ["🥢", "📐"]})

q("p-penney", "paradox",
  "Anna wartet auf Kopf-Kopf-Kopf, Ben auf Zahl-Kopf-Kopf. Eine Münze wird geworfen, bis eine der beiden Folgen erscheint. Wie wahrscheinlich gewinnt Ben?",
  "Anna gewinnt nur, wenn gleich die ersten drei Würfe KKK sind (1/8). Ist einmal Zahl gefallen, kommt vor jedem KKK zwangsläufig zuerst ZKK. Ben gewinnt mit 7/8.",
  "let a=coin(),b=coin(); for(;;){ const c=coin(); if(a&&b&&c) return false; if(!a&&b&&c) return true; a=b; b=c; }",
  F(7, 8), {"t": "coins", "n": 3}, boss=True)

q("p-gambler", "paradox",
  "Roulette mit 37 Feldern (18 davon rot): Fünfmal in Folge kam Rot. Wie wahrscheinlich kommt beim nächsten Dreh wieder Rot?",
  "Das Rad hat kein Gedächtnis: Es bleiben 18 von 37 Feldern, also ≈ 48,6 %. Der Glaube, jetzt sei Schwarz «fällig», heisst Spielerfehlschluss.",
  "for(let i=0;i<5;i++) if(int(37)>=18) return null; return int(37)<18;",
  F(18, 37), {"t": "roulette"}, casino=True)


# ---------------------------------------------------------------- Ausgabe
def main():
    out = []
    seen = set()
    for item in Q:
        assert item["id"] not in seen, item["id"]
        seen.add(item["id"])
        e = item["exact"]
        p = float(e)
        assert 0.001 <= p <= 0.999, (item["id"], p)
        out.append({
            "id": item["id"], "cat": item["cat"], "q": item["q"], "how": item["how"],
            "scene": item["scene"], "boss": item["boss"], "casino": item["casino"],
            "num": str(e.numerator), "den": str(e.denominator), "p": p,
            "sim": item["sim"],
        })
    root = Path(__file__).resolve().parent.parent
    js = ("// Automatisch erzeugt von tools/build_questions.py – nicht von Hand bearbeiten.\n"
          "// Fragen als JSON: exakte Lösung als Bruch (num/den), p als Kommazahl, sim = JS-Funktionsrumpf.\n"
          "var ODDLE_QUESTIONS = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n")
    (root / "js" / "questions.js").write_text(js, encoding="utf-8")
    cats = {}
    for item in out:
        cats[item["cat"]] = cats.get(item["cat"], 0) + 1
    print(f"{len(out)} Fragen geschrieben:", cats)
    for item in out:
        print(f"  {item['id']:<16} {item['p'] * 100:8.3f} %")


if __name__ == "__main__":
    main()
