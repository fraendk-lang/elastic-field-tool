#!/bin/bash
# Script to create GitHub issues from drafts
# Run this script to create all issues at once

set -e

echo "Creating GitHub issues from drafts..."
echo "Make sure you have gh CLI installed and authenticated"
echo ""

echo "Creating issue 1: Kleine Timeline unter der Automation zur besseren Kontrolle"
gh issue create \
  --title "Kleine Timeline unter der Automation zur besseren Kontrolle" \
  --body "## Beschreibung\n\nEine kleine Timeline unter der Automation würde die Kontrolle über die Abläufe verbessern und einen besseren Überblick bieten. Dies könnte durch visuelle Darstellungen der Automatisierungsprozesse erreicht werden.\n\n## Vorteile\n- Bessere Nachverfolgbarkeit von Änderungen\n- Erhöhte Transparenz der Automatisierungsabläufe\n- Möglichkeit zur frühzeitigen Identifizierung von Problemen\n\n## Aufgaben\n- [ ] Entwurf der Timeline-Funktionalität\n- [ ] Implementierung der Visualisierung\n- [ ] Tests zur Überprüfung der Funktionalität"

echo "All issues created successfully!"