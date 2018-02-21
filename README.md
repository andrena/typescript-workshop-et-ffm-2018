# ET FFM 2018 TypeScript für Starter - Übung 1: CanvasPaint

CanvasPaint ist ein minimales TypeScript Projekt, das einen stark vereinfachten grafischen Editor mittels HTML5 Canvas
bereitstellt. Es ist zum Einstieg in TypeScript ohne weitere Komplikationen gedacht und hat daher (außer TypeScript
selbst) keine Abhängigkeiten.

Eine GUI-Bibliothek, Aufteilung in mehrere Dateien, ein Buildsystem, Backend, Tests und aufwendigeres Styling wird es
erst in der zweiten Übung geben.

## Installation
 * [Node.js](https://nodejs.org/) 8.9 installieren
 * `npm install` in diesem Verzeichnis ausführen

## Ausführung
 * `npm run build` kompiliert einmalig die TypeScript-Datei in eine JavaScript-Datei 
 * `npm run watch` kompiliert automatisch bei jeder Änderung und ist zum Entwickeln gedacht 
 * Die Anwendung lässt sich direkt ohne Server in einem Browser anzeigen ([canvas.html](canvas.html) öffnen)
 * Es ist eine rudimentäre Fehleranzeige enhalten, damit JavaScript-Fehler zur Laufzeit nicht unentdeckt bleiben
   - Empfehlung: Immer die Entwicklungswerkzeuge des Browser geöffnet haben (mittels F12 bei den meisten).
   - Tip: Chrome zeigt in der Konsole die originalen Zeilennummern der TypeScript-Dateien in Stack Traces an.
     Ansonsten sieht man nur die Zeilennummern innerhalb der generierten JavaScript-Dateien.

## Aufgaben
Zu Beginn der Übung kann CanvasPaint noch nicht viel und das standardmäßig aktive Zeichenwerkzeug tut gar nichts.

Man kann aber bereits auf einen schwarzen Stift wechseln, mit dem durch Klicken und gedrückt Halten im Zeichenbereich
schwarze Linien gezeichnet werden können.

### Roter Stift
Ein weiteres Zeichenwerkzeug soll in der Liste auswählbar sein, mit dem sich rote Linien zeichen lassen, etwa als neue
Klasse `RedPen`.

### Blauer Stift
Ein weiteres Zeichenwerkzeug soll in der Liste auswählbar sein, mit dem sich blaue Linien zeichen lassen, etwa als neue
Klasse `BluePen`.

### Vereinheitlichung
Die vier jetzt vorhandenen Tool-Klassen sollen möglichst kompakt sein und keinen duplizierten Code enthalten.

Tip:
TypeScript hat eine besonders kompakte Syntax für viele gängige Aufgaben, etwa das Setzen von Attributen einer Klasse im
Konstruktor:

```
class Demo1 {
    constructor(private rating: number) {
    }
}

// ist äquivalent zu

class Demo2 {
    private rating: number;
    constructor(rating: number) {
        this.rating = rating;
    }
}
```

### Geraden zeichnen
Ein weiteres Zeichenwerkzeug soll in der Liste auswählbar sein, mit dem schwarze Geraden gezeichnet werden können sollen.
Es ist hierbei völlig ausreichen, wenn die Linie erst beim Loslassen der Maustaste gezeichnet wird.

Hintergrund:
Das HTML5 `<canvas>`-Element entspricht einem einzigen großen Puffer, indem die Farbwerte der Pixel direkt gesetzt
werden. Gesetzte Werte können nicht trivial wieder rückgängig gemacht werden. Es gäbe allerdings Strategien wie sich
so eine Vorschaufunktion trotzdem umsetzen ließe.

### Radieren
Ein weiteres Zeichenwerkzeug soll in der Liste auswählbar sein, mit dem sich Bereiche der Grafik auf weiß zurück setzen
lassen.

Empfehlung:
Ein rechteckiger Radierer ist einfacher als ein kreisförmiger.

## Zusätzliche Informationen
 * [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/) (freies Buch über TypeScript)
 * Dokumentation zum [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 * Code Completion der IDE 😊
