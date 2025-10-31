#!/bin/bash
cd "/Users/macbookpro/Library/Mobile Documents/com~apple~CloudDocs/vabene/VaBene-CRM-DashBoard"

# Tuer tous les processus Git
pkill -9 git 2>/dev/null
pkill -9 -f "git.*commit" 2>/dev/null
sleep 2

# Supprimer tous les fichiers de verrouillage
rm -f .git/index.lock .git/index.tmp.lock .git/*.lock

# Réinitialiser Git
rm -rf .git
git init

# Ajouter le remote
git remote add origin https://github.com/BeauzenTech/bene_bo.git

# Ajouter tous les fichiers et commit
git add .
git commit -m "feat: Afficher les emails guestEmail dans la liste des utilisateurs ayant utilise le coupon"

# Créer la branche main et pousser
git branch -M main
git push -u origin main --force

echo "TERMINE!"

