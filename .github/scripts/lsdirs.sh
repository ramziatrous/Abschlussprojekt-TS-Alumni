#!/bin/bash
# ohne Params, gibt es eine Liste von allen Verzeichnissen aus dem aktuellen Verzeichnis aus.
# Erstellt ein JSON-Objekt mit allen Lambda-Definitionen

# Verzeichnisse der Lambda-Funktionen finden
directories=$(find ./Abschlussprojekt-Backend/lambda-functions/* -type d -prune)
dirs="["                                                # Initialisierung von Variablen
lambdi="{"
count=0

# Durchlaufen der Lambda-Funktionsverzeichnisse
for dir in $directories; do
    dirs="$dirs\"$(echo "$dir" | sed 's/.\/Abschlussprojekt-Backend/lambda-functions\///')\","

    lambdi="$lambdi\"$count\": $(cat $dir/lambda_def.json), "  # Extrahieren von Informationen aus lambda_def.json und Erstellen einer JSON-Struktur
    count=$((count+1))
done

# Formatierung der Verzeichnisliste und Lambda-JSON-Struktur
dirs="${dirs::-1}]"
lambdi="${lambdi::-2}}"

# Schreiben der Ergebnisse in lambdi.json
echo "$lambdi" > lambdi.json
echo "$dirs"