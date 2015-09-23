*******
ver 1.1
*******
-der bug mit den falschen farben für die dragger wurde behoben

-der code ist jetzt auskommentiert

-es sind noch restrictions für die input felder implementiert worden (das z.b. keine unsinnigen werte eingegeben werden können, oder diese dann für komisches verhalten sorgen)

-bitte nochmal folgende dokumente anschauen und auf fehler überprüfen:

circle, html_controller, index.html

-----------------------------------------#
*******
ver 1.2
*******
-parametric line wird korrekt dargestellt (tested)

-buttons und input felder fuer die aufgabe 1.2 wurden erstellt

-exception fuer eingabe falscher formeln (fx,fy) eingefuegt (exception handling überdenken, .change funktionen momentan auskommentiert)

-isHit() von parametric_line ist implementiert (tested)

-hide and show von parametric_line, sowie das korrekte anzeigen der attributwerte der kurve ist implementiert (tested)

-funktionalitäten der inputfelder sind implementiert, aber haben noch massive bugs (solved) 

-zeitweise konnte ich die segmentanzahl eines objektes verändern, welche dann auch angezeigt wurde (solved)

-parameter tmin,tmax und segments lassen sich dynamisch verändern, das objekt wird anschliessend neu gezeichnet(!!)

-bezier curve wird korrekt dargestellt

-durch die dragger kann die bezier jetzt verschoben und verdreht werden

-tickmarks werden korrekt angezeigt 

-kontrollpolygon wird korrekt angezeigt

-code ist zu 80% auskommentiert(Hinweise auf Mini-Bugs findest du in den jeweiligen Kommentaren)
------------------------------------------

-exception handling bei den formeln x(t),y(t) funktioniert noch nicht 100% (50% solved^^)
->es werden nun bei aufruf anderer elemente die inputfelder von x(t) und y(t) geleert

-(exception handling überdenken, .change funktionen momentan auskommentiert) (canceled)

-die segmentstriche muessen implementiert und mit der dazugehoerigen checkbox verknuepft werden (100%)
->hier muss noch weiter ausgearbeitet/getestet werden(abstände,winkel,vektoren etc überprüfen) (solved)

-unticked muss die segmentstriche wieder verschwinden lassen !!! d.h. neu zeichnen-->html controller(solved)

-bezier_curve klasse braucht einen Dragger(solved)

-kontrollpolygon  --> spezifischer dragger für die linien des polygons(solved)

-farbwechsel testen(nach erstellen von bezier,linie zeichnen und farbe ändern->war kurz buggy)(solved)

-checkboxen aktualisieren sich nicht (solved)

-de-casteljau algorithmus
------------------------------------------

- Parametric Curves werden jetzt zufällig generiert, nicht mehr mit immer denselben Werten

- Kommentare sind überarbeitet

- Das Problem mit den Checkboxen ist gelöst - ist der Haken gesetzt, werden die Marks bei neuen Objekten jetzt sofort nach
dem Zeichnen angezeigt, sodass eine umständlichere Aktualisierung nicht mehr notwendig ist
