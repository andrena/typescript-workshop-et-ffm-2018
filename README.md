# Aufgaben

## Aufgabe: GeoLocationServiceLinear
Um die Karte testen zu können, ohne dabei durch Frankfurt fahren zu müssen, soll ein weiterer GeolocationService implementiert werden.
Dieser soll eine Position simulieren, die sich auf einer Geraden bewegt.
- Vervollständige die Klasse `GeolocationServiceLinear` entsprechend.
- Binde sie in `App.tsx` oben ein, damit sich die aktuelle Position verändert und per Doppelklick gesetzt werden kann.

Um die Entwicklung zu leiten, existieren dafür auch schon Tests (`GeolocationServiceLinear.test.ts`), die per `npm run test` ausgeführt werden können.
Tests, die initial rot sind, sind mit `.skip` am Anfang der Datei ignoriert und müssen wieder aktiviert werden.


## Aufgabe: Polygone anzeigen und entfernen
Polygone werden bereits vom Backend geladen und im Panel aufgelistet. Sie werden aber noch nicht auf der Karte angezeigt.

In der Klasse `PolygonStore` wird anhand der ID verwaltet, welche Polygone sich auf der Karte befinden (Elemente auf der Karte werden *Features* genannt).
- Implementiere die Methode `savePolygonFeature`, um gezeichnete Polygone in der Liste zu speichern.

Die Methode `determineMissingPolygons` erhält eine Liste von Polygonen und soll davon alle zurückgeben, die noch nicht im `PolygonStore`
gespeichert sind (also deren ID nicht in der `polygonIdFeatureList` vorkommt).
- Implementiere die Methode `determineMissingPolygons` und achte auf die zugehörigen Tests.

Der umgekehrte Fall ist, dass ein Polygon aus dem Panel gelöscht wird und jetzt auch von der Karte entfernt werden muss.
Die Methode `returnAndRemoveAllBut` erhält als Eingabe eine ID-Liste und soll alle zugehörigen Features aus der
`polygonIdFeatureList` zurückgeben und diese auch aus der Liste entfernen.
- Implementiere die Methode `returnAndRemoveAllBut` und achte auf die zugehörigen Tests.

*Für React-Kenner: Wir überbrücken damit den deklarativen Ansatz von React und den imperativen Ansatz der Kartenbibliothek.*

## Aufgabe: Status-Badge
Die "on"-Badge im Panel soll grün werden, wenn sich die aktuelle Position innerhalb des zugehörigen Polygons befindet.
Der entsprechende *Ray-Tracing*-Algorithmus ist bereits implementiert und soll jetzt eingebunden werden.
- Schreibe einen neuen *interface*-Typ in `model.ts`, der das `GeoPolygon` um ein boolean Feld `active` erweitert.
- In App.tsx `addPolygonStatus`: Verwende die Funktion `isWithinPolygon` und den neuen Typ, um dieses Feld für alle Polygone zu setzen.
- Passe die Typ-Annotationen überall an wo es nötig ist.
- Implementiere die Methode `renderBadge` in `PolygonListItem.tsx`, damit alle Tests grün sind und das Feature funktioniert.
