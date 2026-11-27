// Automatisch erzeugt von tools/build_questions.py – nicht von Hand bearbeiten.
// Fragen als JSON: exakte Lösung als Bruch (num/den), p als Kommazahl, sim = JS-Funktionsrumpf.
var ODDLE_QUESTIONS = [
 {
  "id": "w-pasch3",
  "cat": "wuerfel",
  "q": "Du wirfst drei Würfel. Wie wahrscheinlich zeigen mindestens zwei davon dieselbe Zahl?",
  "how": "Leichter über das Gegenteil: Alle drei verschieden geht auf 6 · 5 · 4 = 120 von 216 Arten. Also 1 − 120/216 = 4/9 ≈ 44,4 %.",
  "scene": {
   "t": "dice",
   "n": 3
  },
  "boss": false,
  "casino": false,
  "num": "4",
  "den": "9",
  "p": 0.4444444444444444,
  "sim": "const a=die(),b=die(),c=die(); return a===b||b===c||a===c;"
 },
 {
  "id": "w-demere",
  "cat": "wuerfel",
  "q": "Du würfelst viermal mit einem Würfel. Wie wahrscheinlich ist mindestens eine Sechs dabei?",
  "how": "Keine Sechs in vier Würfen: (5/6)⁴ = 625/1296. Also 671/1296 ≈ 51,8 %. Mit genau dieser Wette verdiente der Chevalier de Méré im 17. Jahrhundert Geld.",
  "scene": {
   "t": "dice",
   "n": 4
  },
  "boss": false,
  "casino": false,
  "num": "671",
  "den": "1296",
  "p": 0.5177469135802469,
  "sim": "for(let i=0;i<4;i++) if(die()===6) return true; return false;"
 },
 {
  "id": "w-demere2",
  "cat": "wuerfel",
  "q": "Du wirfst 24-mal zwei Würfel. Wie wahrscheinlich kommt mindestens einmal eine Doppelsechs?",
  "how": "Eine Doppelsechs hat 1/36. Keine in 24 Würfen: (35/36)²⁴ ≈ 50,9 %. Es bleiben nur ≈ 49,1 % – knapp unter der Hälfte. Diese Wette kostete de Méré Geld.",
  "scene": {
   "t": "dice",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "11033126465283976852912127963392284191",
  "den": "22452257707354557240087211123792674816",
  "p": 0.49140387613090325,
  "sim": "for(let i=0;i<24;i++){ const a=die(),b=die(); if(a===6&&b===6) return true; } return false;"
 },
 {
  "id": "w-sum7",
  "cat": "wuerfel",
  "q": "Zwei Würfel: Wie wahrscheinlich ist die Augensumme genau 7?",
  "how": "Sechs der 36 Kombinationen ergeben 7: 1+6, 2+5, 3+4 und umgekehrt. 6/36 = 1/6 – die 7 ist die häufigste Summe.",
  "scene": {
   "t": "dice",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "6",
  "p": 0.16666666666666666,
  "sim": "return die()+die()===7;"
 },
 {
  "id": "w-five-diff",
  "cat": "wuerfel",
  "q": "Fünf Würfel auf einmal: Wie wahrscheinlich zeigen alle fünf verschiedene Zahlen?",
  "how": "Der erste Würfel darf alles, danach bleiben 5, 4, 3 und 2 freie Zahlen: 6 · 5 · 4 · 3 · 2 = 720 von 6⁵ = 7776 Würfen, also 5/54 ≈ 9,3 %.",
  "scene": {
   "t": "dice",
   "n": 5
  },
  "boss": false,
  "casino": false,
  "num": "5",
  "den": "54",
  "p": 0.09259259259259259,
  "sim": "return distinct([die(),die(),die(),die(),die()]);"
 },
 {
  "id": "w-sum13",
  "cat": "wuerfel",
  "q": "Drei Würfel: Wie wahrscheinlich ist die Augensumme 13 oder mehr?",
  "how": "Abzählen von oben: Summe 18 geht auf 1 Art, 17 auf 3, 16 auf 6, 15 auf 10, 14 auf 15, 13 auf 21. Zusammen 56 von 216 = 7/27 ≈ 25,9 %.",
  "scene": {
   "t": "dice",
   "n": 3
  },
  "boss": false,
  "casino": false,
  "num": "7",
  "den": "27",
  "p": 0.25925925925925924,
  "sim": "return die()+die()+die()>=13;"
 },
 {
  "id": "w-prod-even",
  "cat": "wuerfel",
  "q": "Die Augenzahlen zweier Würfel werden multipliziert. Wie wahrscheinlich ist das Produkt gerade?",
  "how": "Ungerade wird das Produkt nur, wenn beide Würfel ungerade sind: 1/2 · 1/2 = 1/4. Also gerade mit 3/4.",
  "scene": {
   "t": "dice",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "3",
  "den": "4",
  "p": 0.75,
  "sim": "return (die()*die())%2===0;"
 },
 {
  "id": "w-four-diff",
  "cat": "wuerfel",
  "q": "Vier Würfel: Wie wahrscheinlich sind alle vier Augenzahlen verschieden?",
  "how": "6 · 5 · 4 · 3 = 360 der 6⁴ = 1296 Würfe haben lauter verschiedene Zahlen. Das sind 5/18 ≈ 27,8 %.",
  "scene": {
   "t": "dice",
   "n": 4
  },
  "boss": false,
  "casino": false,
  "num": "5",
  "den": "18",
  "p": 0.2777777777777778,
  "sim": "return distinct([die(),die(),die(),die()]);"
 },
 {
  "id": "w-wait6",
  "cat": "wuerfel",
  "q": "Du würfelst, bis die erste Sechs kommt. Wie wahrscheinlich brauchst du mehr als sechs Würfe?",
  "how": "Mehr als sechs Würfe heisst: In den ersten sechs kam keine Sechs. (5/6)⁶ ≈ 33,5 % – jeder Dritte wartet länger, als das Bauchgefühl meint.",
  "scene": {
   "t": "dice",
   "n": 1
  },
  "boss": false,
  "casino": false,
  "num": "15625",
  "den": "46656",
  "p": 0.33489797668038407,
  "sim": "for(let i=0;i<6;i++) if(die()===6) return false; return true;"
 },
 {
  "id": "w-sum10",
  "cat": "wuerfel",
  "q": "Drei Würfel: Wie wahrscheinlich ist die Augensumme genau 10?",
  "how": "27 der 216 Kombinationen ergeben 10 (zum Beispiel 1+3+6 in sechs Reihenfolgen). 27/216 = 1/8 = 12,5 %.",
  "scene": {
   "t": "dice",
   "n": 3
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "8",
  "p": 0.125,
  "sim": "return die()+die()+die()===10;"
 },
 {
  "id": "w-ten-no6",
  "cat": "wuerfel",
  "q": "Zehn Würfel auf einmal. Wie wahrscheinlich ist keine einzige Sechs dabei?",
  "how": "Jeder Würfel verfehlt die Sechs mit 5/6, unabhängig voneinander: (5/6)¹⁰ ≈ 16,2 %.",
  "scene": {
   "t": "dice",
   "n": 10
  },
  "boss": false,
  "casino": false,
  "num": "9765625",
  "den": "60466176",
  "p": 0.16150558288984573,
  "sim": "for(let i=0;i<10;i++) if(die()===6) return false; return true;"
 },
 {
  "id": "w-diff2",
  "cat": "wuerfel",
  "q": "Zwei Würfel: Wie wahrscheinlich unterscheiden sich die Augenzahlen um genau 2?",
  "how": "Abstand 2 haben (1,3), (2,4), (3,5) und (4,6), jeweils in beiden Reihenfolgen. Das sind 8 von 36, also 2/9 ≈ 22,2 %.",
  "scene": {
   "t": "dice",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "2",
  "den": "9",
  "p": 0.2222222222222222,
  "sim": "return Math.abs(die()-die())===2;"
 },
 {
  "id": "w-six-all",
  "cat": "wuerfel",
  "q": "Sechs Würfel auf einmal: Wie wahrscheinlich kommt jede Zahl von 1 bis 6 genau einmal vor?",
  "how": "Es gibt 6! = 720 passende Reihenfolgen unter 6⁶ = 46 656 Würfen. Das sind 5/324 ≈ 1,5 %.",
  "scene": {
   "t": "dice",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "5",
  "den": "324",
  "p": 0.015432098765432098,
  "sim": "return distinct([die(),die(),die(),die(),die(),die()]);"
 },
 {
  "id": "k-two-aces",
  "cat": "karten",
  "q": "Aus einem gemischten 52er-Kartenspiel ziehst du zwei Karten. Wie wahrscheinlich sind beide Asse?",
  "how": "Erste Karte Ass: 4/52, zweite dann noch 3/51. 4/52 · 3/51 = 1/221 ≈ 0,45 %.",
  "scene": {
   "t": "cards",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "221",
  "p": 0.004524886877828055,
  "sim": "const h=hand(2); return rank(h[0])===0&&rank(h[1])===0;"
 },
 {
  "id": "k-pair5",
  "cat": "karten",
  "q": "Du ziehst fünf Karten. Wie wahrscheinlich haben mindestens zwei davon denselben Wert (z. B. zwei Könige)?",
  "how": "Gegenteil: fünf verschiedene Werte. C(13,5) Wertekombinationen mal 4⁵ Farben ergibt 1 317 888 von 2 598 960 Händen. Bleiben ≈ 49,3 % mit mindestens einem Paar.",
  "scene": {
   "t": "cards",
   "n": 5
  },
  "boss": false,
  "casino": true,
  "num": "2053",
  "den": "4165",
  "p": 0.4929171668667467,
  "sim": "return !distinct(hand(5).map(rank));"
 },
 {
  "id": "k-four-suit",
  "cat": "karten",
  "q": "Du ziehst fünf Karten. Wie wahrscheinlich sind mindestens vier davon in derselben Farbe (z. B. vier Herz)?",
  "how": "Genau vier einer Farbe: 4 · C(13,4) · 39 = 111 540 Hände, alle fünf einer Farbe: 4 · C(13,5) = 5148. Zusammen 116 688 von 2 598 960 ≈ 4,5 %.",
  "scene": {
   "t": "cards",
   "n": 5
  },
  "boss": false,
  "casino": true,
  "num": "11",
  "den": "245",
  "p": 0.044897959183673466,
  "sim": "return counts(hand(5),suit)[0]>=4;"
 },
 {
  "id": "k-heart-ace",
  "cat": "karten",
  "q": "Du deckst die oberste Karte eines gemischten Spiels auf. Wie wahrscheinlich ist sie ein Herz oder ein Ass?",
  "how": "13 Herzen plus 4 Asse, aber das Herz-Ass ist doppelt gezählt: 13 + 4 − 1 = 16 von 52 Karten, also 4/13 ≈ 30,8 %.",
  "scene": {
   "t": "cards",
   "n": 1
  },
  "boss": false,
  "casino": false,
  "num": "4",
  "den": "13",
  "p": 0.3076923076923077,
  "sim": "const c=int(52); return suit(c)===0||rank(c)===0;"
 },
 {
  "id": "k-same-suit",
  "cat": "karten",
  "q": "Du ziehst zwei Karten. Wie wahrscheinlich haben beide dieselbe Farbe (Herz, Karo, Pik oder Kreuz)?",
  "how": "Die erste Karte ist egal. Von den 51 übrigen haben noch 12 ihre Farbe: 12/51 = 4/17 ≈ 23,5 %.",
  "scene": {
   "t": "cards",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "4",
  "den": "17",
  "p": 0.23529411764705882,
  "sim": "const h=hand(2); return suit(h[0])===suit(h[1]);"
 },
 {
  "id": "k-no-ace13",
  "cat": "karten",
  "q": "Du bekommst 13 Karten aus einem 52er-Spiel. Wie wahrscheinlich ist kein einziges Ass dabei?",
  "how": "Alle 13 Karten müssen aus den 48 Nicht-Assen kommen: C(48,13)/C(52,13) ≈ 30,4 %.",
  "scene": {
   "t": "cards",
   "n": 7
  },
  "boss": false,
  "casino": false,
  "num": "6327",
  "den": "20825",
  "p": 0.30381752701080433,
  "sim": "return hand(13).every(c=>rank(c)!==0);"
 },
 {
  "id": "k-void",
  "cat": "karten",
  "q": "Du bekommst 13 Karten aus einem 52er-Spiel. Wie wahrscheinlich fehlt dir mindestens eine Farbe komplett?",
  "how": "Ein- und Ausschluss: 4 · C(39,13) Hände ohne eine bestimmte Farbe, minus 6 · C(26,13) doppelt gezählte ohne zwei Farben, plus 4 · C(13,13). Geteilt durch C(52,13) ergibt ≈ 5,1 %.",
  "scene": {
   "t": "cards",
   "n": 7
  },
  "boss": true,
  "casino": false,
  "num": "1621364909",
  "den": "31750677980",
  "p": 0.05106552086923342,
  "sim": "const s=[0,0,0,0]; for(const c of hand(13)) s[suit(c)]++; return s.indexOf(0)>=0;"
 },
 {
  "id": "k-adjacent",
  "cat": "karten",
  "q": "Du mischst ein 52er-Spiel gründlich. Wie wahrscheinlich liegen irgendwo zwei gleichwertige Karten (z. B. zwei Damen) direkt nebeneinander?",
  "how": "Jedes der 51 Nachbarpaare ist mit 3/51 = 1/17 gleichwertig, im Schnitt gibt es also drei solche Paare pro Mischung. Die exakte Zählung aller Anordnungen lässt nur ≈ 4,5 % ohne ein einziges Paar übrig.",
  "scene": {
   "t": "cards",
   "n": 7
  },
  "boss": true,
  "casino": false,
  "num": "14106155195322653027266764449243803213268",
  "den": "14778213400262135041705388361938994140625",
  "p": 0.9545237176689056,
  "sim": "const p=perm(52); for(let i=1;i<52;i++) if(p[i]%13===p[i-1]%13) return true; return false;"
 },
 {
  "id": "k-fixed",
  "cat": "karten",
  "q": "Zwei 52er-Spiele werden gemischt und gleichzeitig Karte für Karte aufgedeckt. Wie wahrscheinlich ist mindestens einmal dieselbe Karte oben?",
  "how": "Das Rencontre-Problem: Die Chance, dass nie etwas übereinstimmt, ist praktisch 1/e ≈ 36,8 %. Also ≈ 63,2 % – fast unabhängig davon, ob mit 10 oder 52 Karten gespielt wird.",
  "scene": {
   "t": "cards",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "333239808909468890675694068318655265019682314241643033726180828783",
  "den": "527177615496365219422618541545122659969212453861982208000000000000",
  "p": 0.6321205588285577,
  "sim": "const p=perm(52); for(let i=0;i<52;i++) if(p[i]===i) return true; return false;"
 },
 {
  "id": "k-face3",
  "cat": "karten",
  "q": "Du ziehst drei Karten. Wie wahrscheinlich ist mindestens ein Bube, eine Dame oder ein König dabei?",
  "how": "Gegenteil: alle drei aus den 40 Karten ohne Bild. C(40,3)/C(52,3) = 9880/22 100 ≈ 44,7 %. Also ≈ 55,3 % mit Bild.",
  "scene": {
   "t": "cards",
   "n": 3
  },
  "boss": false,
  "casino": false,
  "num": "47",
  "den": "85",
  "p": 0.5529411764705883,
  "sim": "return hand(3).some(c=>rank(c)>=10);"
 },
 {
  "id": "k-first-ace",
  "cat": "karten",
  "q": "Du deckst ein gemischtes Spiel von oben auf. Wie wahrscheinlich ist unter den ersten zehn Karten noch kein Ass?",
  "how": "Die zehn Karten müssen alle aus den 48 Nicht-Assen stammen: C(48,10)/C(52,10) ≈ 41,3 %.",
  "scene": {
   "t": "cards",
   "n": 5
  },
  "boss": false,
  "casino": false,
  "num": "246",
  "den": "595",
  "p": 0.4134453781512605,
  "sim": "const p=perm(52); for(let i=0;i<10;i++) if(rank(p[i])===0) return false; return true;"
 },
 {
  "id": "k-two-pair",
  "cat": "karten",
  "q": "Poker mit fünf Karten: Wie wahrscheinlich hältst du genau zwei Paare?",
  "how": "Zwei Werte für die Paare: C(13,2) = 78, je C(4,2) = 6 Farben, dazu eine fünfte Karte aus 44: 78 · 36 · 44 = 123 552 von 2 598 960 ≈ 4,75 %.",
  "scene": {
   "t": "cards",
   "n": 5
  },
  "boss": false,
  "casino": true,
  "num": "198",
  "den": "4165",
  "p": 0.0475390156062425,
  "sim": "const c=counts(hand(5),rank); return c[0]===2&&c[1]===2;"
 },
 {
  "id": "k-trips",
  "cat": "karten",
  "q": "Poker mit fünf Karten: Wie wahrscheinlich hältst du genau einen Drilling (drei Gleiche, sonst nichts)?",
  "how": "13 Werte mal C(4,3) = 4 Farben, dazu zwei verschiedene andere Werte: C(12,2) · 4 · 4. Zusammen 54 912 von 2 598 960 ≈ 2,1 %.",
  "scene": {
   "t": "cards",
   "n": 5
  },
  "boss": false,
  "casino": true,
  "num": "88",
  "den": "4165",
  "p": 0.02112845138055222,
  "sim": "const c=counts(hand(5),rank); return c[0]===3&&c[1]===1;"
 },
 {
  "id": "m-five-of-ten",
  "cat": "muenzen",
  "q": "Du wirfst eine Münze zehnmal. Wie wahrscheinlich kommt genau fünfmal Kopf?",
  "how": "C(10,5) = 252 der 1024 Abfolgen haben genau fünf Kopf, also ≈ 24,6 %. Das «ausgeglichene» Ergebnis ist keineswegs der Normalfall.",
  "scene": {
   "t": "coins",
   "n": 10
  },
  "boss": false,
  "casino": false,
  "num": "63",
  "den": "256",
  "p": 0.24609375,
  "sim": "let k=0; for(let i=0;i<10;i++) if(coin()) k++; return k===5;"
 },
 {
  "id": "m-run4",
  "cat": "muenzen",
  "q": "Zehn Münzwürfe: Wie wahrscheinlich kommt irgendwo mindestens viermal Kopf in Folge?",
  "how": "Man zählt die Folgen ohne vier Kopf am Stück Schritt für Schritt (nach Länge der aktuellen Kopfserie): 773 von 1024. Bleiben 251/1024 ≈ 24,5 %.",
  "scene": {
   "t": "coins",
   "n": 10
  },
  "boss": false,
  "casino": false,
  "num": "251",
  "den": "1024",
  "p": 0.2451171875,
  "sim": "let r=0; for(let i=0;i<10;i++){ if(coin()){ if(++r>=4) return true; } else r=0; } return false;"
 },
 {
  "id": "m-run5any",
  "cat": "muenzen",
  "q": "Zwanzig Münzwürfe: Wie wahrscheinlich gibt es irgendwo fünf gleiche Seiten in Folge (Kopf oder Zahl)?",
  "how": "Folgen ohne Fünferserie lassen sich wie Fibonacci-Zahlen aufbauen: Jede neue Serie ist 1 bis 4 lang. Das ergibt ≈ 54 % ohne Serie, also ≈ 46 % mit – lange Serien sind viel häufiger, als man denkt.",
  "scene": {
   "t": "coins",
   "n": 10
  },
  "boss": true,
  "casino": false,
  "num": "240335",
  "den": "524288",
  "p": 0.4584026336669922,
  "sim": "let prev=-1,r=0; for(let i=0;i<20;i++){ const c=coin()?1:0; r=(c===prev)?r+1:1; prev=c; if(r>=5) return true; } return false;"
 },
 {
  "id": "m-three-same",
  "cat": "muenzen",
  "q": "Drei Münzen: Wie wahrscheinlich zeigen alle dieselbe Seite?",
  "how": "KKK oder ZZZ: 2 von 8 gleich wahrscheinlichen Ausgängen, also 1/4. Der beliebte Schluss «zwei sind sowieso gleich, die dritte passt mit 1/2» ist falsch.",
  "scene": {
   "t": "coins",
   "n": 3
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "4",
  "p": 0.25,
  "sim": "const a=coin(),b=coin(),c=coin(); return a===b&&b===c;"
 },
 {
  "id": "m-100",
  "cat": "muenzen",
  "q": "100 Münzwürfe: Wie wahrscheinlich liegt die Zahl der Köpfe zwischen 45 und 55 (beide eingeschlossen)?",
  "how": "Man summiert C(100,k)/2¹⁰⁰ für k = 45 bis 55. Die Standardabweichung ist 5, das Fenster ist also gut ±1 Standardabweichung breit: ≈ 72,9 %.",
  "scene": {
   "t": "coins",
   "n": 10
  },
  "boss": false,
  "casino": false,
  "num": "28868641920228451421269389993",
  "den": "39614081257132168796771975168",
  "p": 0.7287469759261652,
  "sim": "let k=0; for(let i=0;i<100;i++) if(coin()) k++; return k>=45&&k<=55;"
 },
 {
  "id": "m-more-heads6",
  "cat": "muenzen",
  "q": "Sechs Münzwürfe: Wie wahrscheinlich kommt öfter Kopf als Zahl?",
  "how": "4, 5 oder 6 Kopf: 15 + 6 + 1 = 22 von 64 Abfolgen ≈ 34,4 %. Nicht 50 %, weil das Unentschieden 3:3 mit 20/64 dazwischenliegt.",
  "scene": {
   "t": "coins",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "11",
  "den": "32",
  "p": 0.34375,
  "sim": "let k=0; for(let i=0;i<6;i++) if(coin()) k++; return k>3;"
 },
 {
  "id": "m-even",
  "cat": "muenzen",
  "q": "Du wirfst eine Münze, bis zum ersten Mal Kopf kommt. Wie wahrscheinlich brauchst du dafür eine gerade Anzahl Würfe?",
  "how": "Ungerade liegt in jedem Paar doppelt vorne: 1/2 gegen 1/4, dann 1/8 gegen 1/16 und so weiter. Gerade bekommt also 1/3, ungerade 2/3.",
  "scene": {
   "t": "coins",
   "n": 1
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "3",
  "p": 0.3333333333333333,
  "sim": "let n=1; while(!coin()) n++; return n%2===0;"
 },
 {
  "id": "m-alt",
  "cat": "muenzen",
  "q": "Fünf Münzwürfe: Wie wahrscheinlich wechseln sich Kopf und Zahl perfekt ab (KZKZK oder ZKZKZ)?",
  "how": "Nur 2 der 32 möglichen Abfolgen wechseln jedes Mal: 2/32 = 1/16 = 6,25 %.",
  "scene": {
   "t": "coins",
   "n": 5
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "16",
  "p": 0.0625,
  "sim": "let prev=coin(); for(let i=1;i<5;i++){ const c=coin(); if(c===prev) return false; prev=c; } return true;"
 },
 {
  "id": "m-same-heads",
  "cat": "muenzen",
  "q": "Zwei Leute werfen je drei Münzen. Wie wahrscheinlich haben beide gleich oft Kopf?",
  "how": "Für 0, 1, 2 oder 3 Kopf gibt es 1, 3, 3 und 1 Abfolge. Gleich oft: (1² + 3² + 3² + 1²)/64 = 20/64 = 5/16 ≈ 31,3 %.",
  "scene": {
   "t": "coins",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "5",
  "den": "16",
  "p": 0.3125,
  "sim": "let a=0,b=0; for(let i=0;i<3;i++){ if(coin()) a++; if(coin()) b++; } return a===b;"
 },
 {
  "id": "g-23",
  "cat": "geburtstag",
  "q": "In einem Raum sind 23 Personen. Wie wahrscheinlich haben mindestens zwei am selben Tag Geburtstag? (365 Tage, alle gleich wahrscheinlich)",
  "how": "Alle verschieden: 365/365 · 364/365 · … · 343/365 ≈ 49,3 %. Also ≈ 50,7 % für ein gemeinsames Datum – denn 23 Leute bilden schon 253 Paare.",
  "scene": {
   "t": "people",
   "n": 23
  },
  "boss": false,
  "casino": false,
  "num": "38093904702297390785243708291056390518886454060947061",
  "den": "75091883268515350125426207425223147563269805908203125",
  "p": 0.5072972343239854,
  "sim": "const s=new Uint8Array(365); for(let i=0;i<23;i++){ const d=int(365); if(s[d]) return true; s[d]=1; } return false;"
 },
 {
  "id": "g-30",
  "cat": "geburtstag",
  "q": "Eine Schulklasse mit 30 Kindern. Wie wahrscheinlich haben zwei am selben Tag Geburtstag? (365 Tage, alle gleich wahrscheinlich)",
  "how": "Wahrscheinlichkeit für lauter verschiedene Daten: das Produkt (365 − i)/365 für i = 0 bis 29 ≈ 29,4 %. Also ≈ 70,6 %.",
  "scene": {
   "t": "people",
   "n": 30
  },
  "boss": false,
  "casino": false,
  "num": "9155292769247515688463664204581601330417463671119878183963440529188469",
  "den": "12962030625262519859085092767427552277425499342208403503894805908203125",
  "p": 0.7063162427192686,
  "sim": "const s=new Uint8Array(365); for(let i=0;i<30;i++){ const d=int(365); if(s[d]) return true; s[d]=1; } return false;"
 },
 {
  "id": "g-10",
  "cat": "geburtstag",
  "q": "Zehn Leute sitzen am Tisch. Wie wahrscheinlich haben zwei am selben Tag Geburtstag? (365 Tage, alle gleich wahrscheinlich)",
  "how": "Lauter verschiedene Daten: 365 · 364 · … · 356 / 365¹⁰ ≈ 88,3 %. Bleiben ≈ 11,7 %.",
  "scene": {
   "t": "people",
   "n": 10
  },
  "boss": false,
  "casino": false,
  "num": "2689423743942044098153",
  "den": "22996713557917153515625",
  "p": 0.11694817771107766,
  "sim": "const s=new Uint8Array(365); for(let i=0;i<10;i++){ const d=int(365); if(s[d]) return true; s[d]=1; } return false;"
 },
 {
  "id": "g-you",
  "cat": "geburtstag",
  "q": "Du bist mit 22 anderen in einem Raum. Wie wahrscheinlich hat jemand am selben Tag Geburtstag wie du? (365 Tage, alle gleich wahrscheinlich)",
  "how": "Jetzt zählt nur dein Datum: Jede der 22 Personen verfehlt es mit 364/365. 1 − (364/365)²² ≈ 5,9 % – fast zehnmal weniger als beim klassischen Geburtstagsparadox.",
  "scene": {
   "t": "people",
   "n": 23
  },
  "boss": false,
  "casino": false,
  "num": "13744472248850982840138348194298674168413346542839439929",
  "den": "234662135214110469141956898203822336135218143463134765625",
  "p": 0.058571325264343346,
  "sim": "const me=int(365); for(let i=0;i<22;i++) if(int(365)===me) return true; return false;"
 },
 {
  "id": "g-50",
  "cat": "geburtstag",
  "q": "Eine Party mit 50 Gästen. Wie wahrscheinlich haben zwei am selben Tag Geburtstag? (365 Tage, alle gleich wahrscheinlich)",
  "how": "50 Gäste bilden 1225 Paare. Lauter verschiedene Daten gibt es nur noch mit ≈ 3,0 %, also ≈ 97,0 % für mindestens ein gemeinsames Datum.",
  "scene": {
   "t": "people",
   "n": 30
  },
  "boss": false,
  "casino": false,
  "num": "7089559865579534365339355463375173405436453685300666030303258890566778889679390456389542412687952202890922699306118801",
  "den": "7306010813549515310358093277059651246342214174497508156711617142094873581852472030624097938198246993124485015869140625",
  "p": 0.9703735795779884,
  "sim": "const s=new Uint8Array(365); for(let i=0;i<50;i++){ const d=int(365); if(s[d]) return true; s[d]=1; } return false;"
 },
 {
  "id": "g-months",
  "cat": "geburtstag",
  "q": "Vier Freundinnen: Wie wahrscheinlich sind alle in verschiedenen Monaten geboren? (12 gleich wahrscheinliche Monate)",
  "how": "12 · 11 · 10 · 9 = 11 880 von 12⁴ = 20 736 Möglichkeiten: 55/96 ≈ 57,3 %.",
  "scene": {
   "t": "people",
   "n": 4
  },
  "boss": false,
  "casino": false,
  "num": "55",
  "den": "96",
  "p": 0.5729166666666666,
  "sim": "return distinct([int(12),int(12),int(12),int(12)]);"
 },
 {
  "id": "g-weekday",
  "cat": "geburtstag",
  "q": "Sieben Leute: Wie wahrscheinlich ist jede an einem anderen Wochentag geboren?",
  "how": "7! = 5040 passende Verteilungen unter 7⁷ = 823 543. Das sind nur ≈ 0,61 %.",
  "scene": {
   "t": "people",
   "n": 7
  },
  "boss": false,
  "casino": false,
  "num": "720",
  "den": "117649",
  "p": 0.006119899021666143,
  "sim": "return distinct([int(7),int(7),int(7),int(7),int(7),int(7),int(7)]);"
 },
 {
  "id": "g-dec",
  "cat": "geburtstag",
  "q": "Fünf Leute: Wie wahrscheinlich hat mindestens eine Person im Dezember Geburtstag? (12 gleich wahrscheinliche Monate)",
  "how": "Niemand im Dezember: (11/12)⁵ ≈ 64,7 %. Also ≈ 35,3 %.",
  "scene": {
   "t": "people",
   "n": 5
  },
  "boss": false,
  "casino": false,
  "num": "87781",
  "den": "248832",
  "p": 0.35277215149176955,
  "sim": "for(let i=0;i<5;i++) if(int(12)===11) return true; return false;"
 },
 {
  "id": "l-three",
  "cat": "casino",
  "q": "Lotto 6 aus 49: Du tippst sechs Zahlen. Wie wahrscheinlich hast du mindestens drei Richtige?",
  "how": "Genau k Richtige: C(6,k) · C(43,6−k) / C(49,6). Für k = 3 bis 6 zusammen 260 624 von 13 983 816 Ziehungen ≈ 1,9 %.",
  "scene": {
   "t": "lotto",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "4654",
  "den": "249711",
  "p": 0.01863754500202234,
  "sim": "const t=sample(49,6),z=sample(49,6); let k=0; for(const x of t) if(z.includes(x)) k++; return k>=3;"
 },
 {
  "id": "l-neighbors",
  "cat": "casino",
  "q": "Lotto 6 aus 49: Wie wahrscheinlich sind unter den sechs gezogenen Zahlen zwei direkte Nachbarn (z. B. 17 und 18)?",
  "how": "Schiebt man die Lücken zusammen, entspricht jede Ziehung ohne Nachbarn genau einer Wahl von sechs Zahlen aus 44. 1 − C(44,6)/C(49,6) ≈ 49,5 % – fast jede zweite Ziehung.",
  "scene": {
   "t": "lotto",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "22483",
  "den": "45402",
  "p": 0.49519844940751506,
  "sim": "const z=sample(49,6).sort((a,b)=>a-b); for(let i=1;i<6;i++) if(z[i]-z[i-1]===1) return true; return false;"
 },
 {
  "id": "l-zero",
  "cat": "casino",
  "q": "Lotto 6 aus 49: Wie wahrscheinlich hast du keine einzige Richtige?",
  "how": "Alle sechs gezogenen Zahlen müssen aus den 43 nicht getippten kommen: C(43,6)/C(49,6) ≈ 43,6 %.",
  "scene": {
   "t": "lotto",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "435461",
  "den": "998844",
  "p": 0.4359649755116915,
  "sim": "const t=sample(49,6),z=sample(49,6); let k=0; for(const x of t) if(z.includes(x)) k++; return k===0;"
 },
 {
  "id": "l-one",
  "cat": "casino",
  "q": "Lotto 6 aus 49: Wie wahrscheinlich hast du genau eine Richtige?",
  "how": "Eine deiner sechs Zahlen und fünf der 43 anderen: 6 · C(43,5)/C(49,6) ≈ 41,3 % – fast so häufig wie gar keine.",
  "scene": {
   "t": "lotto",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "68757",
  "den": "166474",
  "p": 0.4130194504847604,
  "sim": "const t=sample(49,6),z=sample(49,6); let k=0; for(const x of t) if(z.includes(x)) k++; return k===1;"
 },
 {
  "id": "l-low",
  "cat": "casino",
  "q": "Lotto 6 aus 49: Wie wahrscheinlich sind alle sechs gezogenen Zahlen 30 oder kleiner?",
  "how": "Alle sechs aus den Zahlen 1 bis 30: C(30,6)/C(49,6) = 593 775/13 983 816 ≈ 4,2 %.",
  "scene": {
   "t": "lotto",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "28275",
  "den": "665896",
  "p": 0.042461585592945446,
  "sim": "return sample(49,6).every(x=>x<=30);"
 },
 {
  "id": "l-even",
  "cat": "casino",
  "q": "Lotto 6 aus 49: Wie wahrscheinlich sind alle sechs gezogenen Zahlen gerade?",
  "how": "Es gibt 24 gerade Zahlen bis 49: C(24,6)/C(49,6) = 134 596/13 983 816 ≈ 0,96 %.",
  "scene": {
   "t": "lotto",
   "n": 6
  },
  "boss": false,
  "casino": false,
  "num": "19",
  "den": "1974",
  "p": 0.009625126646403243,
  "sim": "return sample(49,6).every(x=>x%2===0);"
 },
 {
  "id": "c-red5",
  "cat": "casino",
  "q": "Roulette mit 37 Feldern (18 rot, 18 schwarz, die Null grün): Wie wahrscheinlich kommt fünfmal hintereinander Rot?",
  "how": "Jeder Dreh ist mit 18/37 rot, unabhängig vom letzten: (18/37)⁵ ≈ 2,7 %.",
  "scene": {
   "t": "roulette"
  },
  "boss": false,
  "casino": false,
  "num": "1889568",
  "den": "69343957",
  "p": 0.027249209329084003,
  "sim": "for(let i=0;i<5;i++) if(int(37)>=18) return false; return true;"
 },
 {
  "id": "c-zero37",
  "cat": "casino",
  "q": "Roulette mit 37 Feldern: Wie wahrscheinlich fällt in 37 Drehungen mindestens einmal die Null?",
  "how": "Keine Null in 37 Drehungen: (36/37)³⁷ ≈ 36,3 %. Also ≈ 63,7 % – obwohl die Null «im Schnitt einmal» kommen sollte.",
  "scene": {
   "t": "roulette"
  },
  "boss": false,
  "casino": false,
  "num": "6725190034523988521000644958907402771481353280695264961621",
  "den": "10555134955777783414078330085995832946127396083370199442517",
  "p": 0.6371486544416641,
  "sim": "for(let i=0;i<37;i++) if(int(37)===0) return true; return false;"
 },
 {
  "id": "a-socks",
  "cat": "alltag",
  "q": "In der Schublade liegen fünf verschiedene Sockenpaare durcheinander. Du greifst im Dunkeln zwei Socken. Wie wahrscheinlich passen sie zusammen?",
  "how": "Die erste Socke ist egal. Von den neun übrigen passt genau eine: 1/9 ≈ 11,1 %.",
  "scene": {
   "t": "emoji",
   "i": [
    "🧦",
    "🧦",
    "🧦",
    "🧦",
    "🧦"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "9",
  "p": 0.1111111111111111,
  "sim": "const h=sample(10,2); return Math.ceil(h[0]/2)===Math.ceil(h[1]/2);"
 },
 {
  "id": "a-wichteln",
  "cat": "alltag",
  "q": "Acht Freunde ziehen beim Wichteln Lose mit ihren Namen. Wie wahrscheinlich zieht niemand sich selbst?",
  "how": "Gesucht sind fixpunktfreie Permutationen: 14 833 der 8! = 40 320 Verlosungen. Das sind ≈ 36,8 %, also fast genau 1/e.",
  "scene": {
   "t": "emoji",
   "i": [
    "🎁",
    "🎁",
    "🎁",
    "🎁",
    "🎁",
    "🎁",
    "🎁",
    "🎁"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "2119",
  "den": "5760",
  "p": 0.36788194444444444,
  "sim": "const p=perm(8); for(let i=0;i<8;i++) if(p[i]===i) return false; return true;"
 },
 {
  "id": "a-playlist",
  "cat": "alltag",
  "q": "Die Zufallswiedergabe wählt aus 20 Songs zehnmal unabhängig einen Song. Wie wahrscheinlich läuft mindestens ein Song doppelt?",
  "how": "Lauter verschiedene Songs: 20 · 19 · … · 11 / 20¹⁰ ≈ 6,5 %. Also ≈ 93,5 % – das Geburtstagsparadox im Kleinen.",
  "scene": {
   "t": "emoji",
   "i": [
    "🎵",
    "🎶",
    "🎵",
    "🎶",
    "🎵"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "373810837",
  "den": "400000000",
  "p": 0.9345270925,
  "sim": "const s=new Uint8Array(20); for(let i=0;i<10;i++){ const x=int(20); if(s[x]) return true; s[x]=1; } return false;"
 },
 {
  "id": "a-lift",
  "cat": "alltag",
  "q": "Vier Leute steigen im Erdgeschoss in den Lift. Jede drückt zufällig eines von acht Stockwerken. Wie wahrscheinlich steigen alle in verschiedenen Stockwerken aus?",
  "how": "8 · 7 · 6 · 5 = 1680 von 8⁴ = 4096 Möglichkeiten: 105/256 ≈ 41,0 %.",
  "scene": {
   "t": "emoji",
   "i": [
    "🛗",
    "🧍",
    "🧍",
    "🧍",
    "🧍"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "105",
  "den": "256",
  "p": 0.41015625,
  "sim": "return distinct([int(8),int(8),int(8),int(8)]);"
 },
 {
  "id": "a-jackets",
  "cat": "alltag",
  "q": "Sechs Gäste bekommen ihre Jacken an der Garderobe völlig zufällig zurück. Wie wahrscheinlich erhalten mindestens zwei ihre eigene Jacke?",
  "how": "Keiner richtig: 265 von 720 Verteilungen, genau einer: 6 · 44 = 264. Bleiben 191/720 ≈ 26,5 % für mindestens zwei.",
  "scene": {
   "t": "emoji",
   "i": [
    "🧥",
    "🧥",
    "🧥",
    "🧥",
    "🧥",
    "🧥"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "191",
  "den": "720",
  "p": 0.2652777777777778,
  "sim": "const p=perm(6); let k=0; for(let i=0;i<6;i++) if(p[i]===i) k++; return k>=2;"
 },
 {
  "id": "a-meet",
  "cat": "alltag",
  "q": "Zwei Freunde kommen unabhängig zu einem zufälligen Zeitpunkt zwischen 12 und 13 Uhr ins Café und warten je 15 Minuten. Wie wahrscheinlich treffen sie sich?",
  "how": "Im Quadrat aller Ankunftszeiten fallen zwei Dreiecke weg, in denen sie mehr als 15 Minuten trennt: 1 − (3/4)² = 7/16 ≈ 43,8 %.",
  "scene": {
   "t": "emoji",
   "i": [
    "☕",
    "🕛",
    "☕"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "7",
  "den": "16",
  "p": 0.4375,
  "sim": "return Math.abs(rnd()-rnd())<=0.25;"
 },
 {
  "id": "a-mc",
  "cat": "alltag",
  "q": "Ein Test hat zehn Fragen mit je vier Antworten. Du rätst überall. Wie wahrscheinlich hast du mindestens fünf richtig?",
  "how": "Binomialverteilung mit p = 1/4: Summe von C(10,k) · (1/4)ᵏ · (3/4)¹⁰⁻ᵏ für k = 5 bis 10 ≈ 7,8 %.",
  "scene": {
   "t": "emoji",
   "i": [
    "📝",
    "❓",
    "❓",
    "❓"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "40961",
  "den": "524288",
  "p": 0.07812690734863281,
  "sim": "let k=0; for(let i=0;i<10;i++) if(int(4)===0) k++; return k>=5;"
 },
 {
  "id": "a-pin",
  "cat": "alltag",
  "q": "Eine vierstellige PIN wird zufällig erzeugt (0000 bis 9999). Wie wahrscheinlich kommt eine Ziffer mehrfach vor?",
  "how": "Lauter verschiedene Ziffern: 10 · 9 · 8 · 7 = 5040 von 10 000. Also 49,6 % mit Wiederholung.",
  "scene": {
   "t": "emoji",
   "i": [
    "🔢",
    "🔒"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "62",
  "den": "125",
  "p": 0.496,
  "sim": "return !distinct([int(10),int(10),int(10),int(10)]);"
 },
 {
  "id": "a-six-start",
  "cat": "alltag",
  "q": "Beim Brettspiel darfst du dreimal würfeln, um mit einer Sechs rauszukommen. Wie wahrscheinlich klappt es?",
  "how": "Dreimal keine Sechs: (5/6)³ = 125/216. Also 91/216 ≈ 42,1 % – weniger als die Hälfte.",
  "scene": {
   "t": "dice",
   "n": 1
  },
  "boss": false,
  "casino": false,
  "num": "91",
  "den": "216",
  "p": 0.4212962962962963,
  "sim": "for(let i=0;i<3;i++) if(die()===6) return true; return false;"
 },
 {
  "id": "a-kids",
  "cat": "alltag",
  "q": "Eine Familie hat vier Kinder (Mädchen und Junge je 50 %). Wie wahrscheinlich sind es genau zwei Mädchen und zwei Jungen?",
  "how": "C(4,2) = 6 der 16 Abfolgen sind 2:2, also 37,5 %. Eine 3:1-Verteilung (in beide Richtungen) ist mit 8/16 sogar wahrscheinlicher.",
  "scene": {
   "t": "emoji",
   "i": [
    "👧",
    "👦",
    "👧",
    "👦"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "3",
  "den": "8",
  "p": 0.375,
  "sim": "let k=0; for(let i=0;i<4;i++) if(coin()) k++; return k===2;"
 },
 {
  "id": "a-dishes",
  "cat": "alltag",
  "q": "Aus zehn WG-Leuten werden drei zufällig zum Abwasch gelost. Wie wahrscheinlich trifft es dich und deine beste Freundin gemeinsam?",
  "how": "Ihr zwei seid dabei, dazu eine der acht anderen Personen: 8 von C(10,3) = 120 Losungen, also 1/15 ≈ 6,7 %.",
  "scene": {
   "t": "emoji",
   "i": [
    "🍽️",
    "🧽",
    "🍽️"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "15",
  "p": 0.06666666666666667,
  "sim": "const s=sample(10,3); return s.includes(1)&&s.includes(2);"
 },
 {
  "id": "a-lights",
  "cat": "alltag",
  "q": "Auf deinem Weg liegen fünf Ampeln, jede ist unabhängig mit 40 % grün. Wie wahrscheinlich hast du überall grün?",
  "how": "0,4⁵ = 32/3125 ≈ 1,0 % – eine «grüne Welle» erlebst du ohne Koordination etwa an einem von hundert Tagen.",
  "scene": {
   "t": "emoji",
   "i": [
    "🚦",
    "🚦",
    "🚦",
    "🚦",
    "🚦"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "32",
  "den": "3125",
  "p": 0.01024,
  "sim": "for(let i=0;i<5;i++) if(rnd()>=0.4) return false; return true;"
 },
 {
  "id": "a-coupons",
  "cat": "alltag",
  "q": "Sammelfiguren: Es gibt sechs verschiedene, jede gleich häufig, eine pro Packung. Wie wahrscheinlich hast du nach zehn Packungen alle sechs?",
  "how": "Gezählt werden Abfolgen, in denen jede Figur vorkommt (Ein- und Ausschluss): 16 435 440 von 6¹⁰ ≈ 27,2 %. Im Schnitt braucht man 14,7 Packungen.",
  "scene": {
   "t": "emoji",
   "i": [
    "📦",
    "🦖",
    "🦄",
    "🐙",
    "🦊",
    "🐢",
    "🐝"
   ]
  },
  "boss": true,
  "casino": false,
  "num": "38045",
  "den": "139968",
  "p": 0.2718121284865112,
  "sim": "const s=new Uint8Array(6); let n=0; for(let i=0;i<10;i++){ const f=int(6); if(!s[f]){ s[f]=1; n++; } } return n===6;"
 },
 {
  "id": "p-monty",
  "cat": "paradox",
  "q": "Drei Türen, hinter einer steht ein Auto. Du wählst Tür 1, der Moderator öffnet eine andere Tür mit einer Ziege. Du wechselst. Wie wahrscheinlich gewinnst du das Auto?",
  "how": "Deine erste Wahl trifft nur mit 1/3. In den anderen 2/3 der Fälle zeigt dir der Moderator, welche der zwei übrigen Türen das Auto hat. Wechseln gewinnt mit 2/3.",
  "scene": {
   "t": "emoji",
   "i": [
    "🚪",
    "🚪",
    "🐐"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "2",
  "den": "3",
  "p": 0.6666666666666666,
  "sim": "const car=int(3); const opts=[1,2].filter(d=>d!==car); const open=opts[int(opts.length)]; const other=open===1?2:1; return other===car;"
 },
 {
  "id": "p-boygirl",
  "cat": "paradox",
  "q": "Eine Familie hat zwei Kinder, mindestens eines ist ein Junge. Wie wahrscheinlich sind beide Jungen?",
  "how": "Gleich wahrscheinlich sind JJ, JM, MJ und MM. Die Information streicht nur MM. Von den drei übrigen ist eine JJ: 1/3.",
  "scene": {
   "t": "emoji",
   "i": [
    "👦",
    "❔"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "3",
  "p": 0.3333333333333333,
  "sim": "const a=coin(),b=coin(); if(!a&&!b) return null; return a&&b;"
 },
 {
  "id": "p-tuesday",
  "cat": "paradox",
  "q": "Eine Familie hat zwei Kinder. Mindestens eines ist ein Junge, der an einem Dienstag geboren wurde. Wie wahrscheinlich sind beide Jungen?",
  "how": "Von 14 × 14 = 196 gleich wahrscheinlichen (Geschlecht, Wochentag)-Paaren enthalten 27 einen Dienstagsjungen, 13 davon sind zwei Jungen. Also 13/27 ≈ 48,1 % – der Wochentag ändert die Antwort.",
  "scene": {
   "t": "emoji",
   "i": [
    "👦",
    "📅",
    "❔"
   ]
  },
  "boss": true,
  "casino": false,
  "num": "13",
  "den": "27",
  "p": 0.48148148148148145,
  "sim": "const a=coin(),b=coin(),da=int(7),db=int(7); if(!((a&&da===1)||(b&&db===1))) return null; return a&&b;"
 },
 {
  "id": "p-box",
  "cat": "paradox",
  "q": "Drei Karten: eine beidseitig rot, eine beidseitig weiss, eine rot und weiss. Du ziehst blind eine und siehst oben Rot. Wie wahrscheinlich ist auch die Unterseite rot?",
  "how": "Es gibt drei rote Seiten, die du sehen könntest. Zwei davon gehören zur rot-roten Karte. Also 2/3, nicht 1/2.",
  "scene": {
   "t": "emoji",
   "i": [
    "🟥",
    "⬜",
    "🔳"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "2",
  "den": "3",
  "p": 0.6666666666666666,
  "sim": "const cards=[[1,1],[0,0],[1,0]]; const c=cards[int(3)], s=int(2); if(c[s]!==1) return null; return c[1-s]===1;"
 },
 {
  "id": "p-efron",
  "cat": "paradox",
  "q": "Würfel A hat die Seiten 2, 2, 4, 4, 9, 9, Würfel B die Seiten 1, 1, 6, 6, 8, 8. Beide werden geworfen. Wie wahrscheinlich zeigt A die höhere Zahl?",
  "how": "A = 2 oder 4 schlägt nur die 1 (je 1/3), A = 9 schlägt alles: (1/3 + 1/3 + 1)/3 = 5/9. Verblüffend: Ein dritter Würfel mit 3, 3, 5, 5, 7, 7 schlägt A und verliert gegen B.",
  "scene": {
   "t": "dice",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "5",
  "den": "9",
  "p": 0.5555555555555556,
  "sim": "const A=[2,2,4,4,9,9],B=[1,1,6,6,8,8]; return A[int(6)]>B[int(6)];"
 },
 {
  "id": "p-test",
  "cat": "paradox",
  "q": "Eine Krankheit hat 1 von 100 Menschen. Ein Test erkennt sie in 99 % der Fälle, schlägt aber auch bei 5 % der Gesunden an. Dein Test ist positiv. Wie wahrscheinlich bist du krank?",
  "how": "Von 10 000 Leuten sind 100 krank, 99 davon positiv. Von den 9900 Gesunden sind 495 falsch positiv. 99/(99 + 495) = 1/6 ≈ 16,7 %.",
  "scene": {
   "t": "emoji",
   "i": [
    "🧪",
    "➕"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "6",
  "p": 0.16666666666666666,
  "sim": "const sick=rnd()<0.01; const pos=sick?rnd()<0.99:rnd()<0.05; if(!pos) return null; return sick;"
 },
 {
  "id": "p-double6",
  "cat": "paradox",
  "q": "Zwei Würfel, jemand verrät dir: Mindestens einer zeigt eine Sechs. Wie wahrscheinlich ist es eine Doppelsechs?",
  "how": "11 der 36 Würfe enthalten eine Sechs, nur einer davon ist (6,6). Also 1/11 ≈ 9,1 %, nicht 1/6.",
  "scene": {
   "t": "dice",
   "n": 2
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "11",
  "p": 0.09090909090909091,
  "sim": "const a=die(),b=die(); if(a!==6&&b!==6) return null; return a===6&&b===6;"
 },
 {
  "id": "p-prisoners",
  "cat": "paradox",
  "q": "100 Gefangene, 100 Kisten mit ihren Nummern in zufälliger Ordnung. Jeder darf 50 Kisten öffnen. Alle überleben nur, wenn jeder seine Nummer findet. Mit der Schleifen-Strategie (erst die eigene Kistennummer, dann immer die gefundene Nummer): Wie wahrscheinlich gewinnen sie?",
  "how": "Die Strategie gewinnt genau dann, wenn die Zufallsanordnung keinen Zyklus länger als 50 hat. Das passiert mit 1 − (1/51 + 1/52 + … + 1/100) ≈ 31,2 % – statt (1/2)¹⁰⁰ beim blinden Raten.",
  "scene": {
   "t": "emoji",
   "i": [
    "📦",
    "📦",
    "📦",
    "🔢",
    "📦",
    "📦"
   ]
  },
  "boss": true,
  "casino": false,
  "num": "21740752665556690246055199895649405434183",
  "den": "69720375229712477164533808935312303556800",
  "p": 0.3118278206898048,
  "sim": "const p=perm(100), seen=new Uint8Array(100); for(let i=0;i<100;i++){ if(seen[i]) continue; let len=0,j=i; while(!seen[j]){ seen[j]=1; j=p[j]; len++; } if(len>50) return false; } return true;"
 },
 {
  "id": "p-stick",
  "cat": "paradox",
  "q": "Ein Stab wird an zwei zufälligen Stellen gebrochen. Wie wahrscheinlich lässt sich aus den drei Stücken ein Dreieck legen?",
  "how": "Ein Dreieck geht genau dann, wenn kein Stück länger als die halbe Länge ist. Im Quadrat aller möglichen Bruchstellen-Paare ist das ein Gebiet mit Fläche 1/4.",
  "scene": {
   "t": "emoji",
   "i": [
    "🥢",
    "📐"
   ]
  },
  "boss": false,
  "casino": false,
  "num": "1",
  "den": "4",
  "p": 0.25,
  "sim": "const a=rnd(),b=rnd(); const x=Math.min(a,b),y=Math.max(a,b); return x<0.5&&y-x<0.5&&1-y<0.5;"
 },
 {
  "id": "p-penney",
  "cat": "paradox",
  "q": "Anna wartet auf Kopf-Kopf-Kopf, Ben auf Zahl-Kopf-Kopf. Eine Münze wird geworfen, bis eine der beiden Folgen erscheint. Wie wahrscheinlich gewinnt Ben?",
  "how": "Anna gewinnt nur, wenn gleich die ersten drei Würfe KKK sind (1/8). Ist einmal Zahl gefallen, kommt vor jedem KKK zwangsläufig zuerst ZKK. Ben gewinnt mit 7/8.",
  "scene": {
   "t": "coins",
   "n": 3
  },
  "boss": true,
  "casino": false,
  "num": "7",
  "den": "8",
  "p": 0.875,
  "sim": "let a=coin(),b=coin(); for(;;){ const c=coin(); if(a&&b&&c) return false; if(!a&&b&&c) return true; a=b; b=c; }"
 },
 {
  "id": "p-gambler",
  "cat": "paradox",
  "q": "Roulette mit 37 Feldern (18 davon rot): Fünfmal in Folge kam Rot. Wie wahrscheinlich kommt beim nächsten Dreh wieder Rot?",
  "how": "Das Rad hat kein Gedächtnis: Es bleiben 18 von 37 Feldern, also ≈ 48,6 %. Der Glaube, jetzt sei Schwarz «fällig», heisst Spielerfehlschluss.",
  "scene": {
   "t": "roulette"
  },
  "boss": false,
  "casino": true,
  "num": "18",
  "den": "37",
  "p": 0.4864864864864865,
  "sim": "for(let i=0;i<5;i++) if(int(37)>=18) return null; return int(37)<18;"
 }
];
