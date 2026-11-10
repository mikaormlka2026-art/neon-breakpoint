# NEON BREAKPOINT — build 0.1

FPS 2.5D navigateur, sans dépendance externe obligatoire. Le rendu utilise un raycaster Canvas 2D (couloirs et murs en perspective) et des sprites procéduraux pour les ennemis et l'arme. Les effets sonores sont synthétisés avec Web Audio API.

## Lancer
- Décompresser l'archive.
- Ouvrir `index.html` dans un navigateur récent. Si le navigateur bloque les modules ES depuis `file://`, lancer un serveur statique dans le dossier (ex. `python -m http.server 8000`) puis ouvrir `http://localhost:8000`.
- Cliquer sur PLAY. Le son s'initialise après ce clic.

## Contrôles
- WASD : déplacement relatif à la direction de visée
- Souris : viser (mouvement horizontal)
- Clic gauche : tirer
- Clic droit : visée (réservé pour une extension de zoom)
- Espace : saut visuel / gestion de hauteur
- Shift : sprint
- C : slide
- Q : dash
- R : recharger
- 1–4 : sélectionner une arme
- Échap : pause

## Architecture
`config.js` paramètres et carte ; `input.js` collecte les entrées ; `engine.js` rendu raycast, collisions de grille, particules et caméra ; `player.js` mouvement ; `weapons.js` armes et hitscan ; `enemies.js` IA et boss ; `audio.js` synthèse Web Audio ; `main.js` orchestration et états UI.

## Contenu de cette build
- 4 armes aux profils distincts, chargeurs et réserves, rechargement.
- Déplacement inertiel, sprint, saut, slide, dash.
- 3 classes d'ennemis avec approche/retrait selon distance et attaques ; apparition du boss après nettoyage de la vague.
- Boss Warden, barre de vie, score et multiplicateur de style.
- Dégâts, knockback, particules, recul d'arme, muzzle flash, shake, crosshair réactif, HUD, pause, réglages de volume et de shake.
- Monde de couloirs en raycasting et collision de grille.

## Limites connues de la build
C'est une première tranche jouable et non un produit AAA final. Les sprites sont procéduraux, l'arsenal est hitscan (sauf effets visuels), la visée est horizontale et le zoom n'est pas encore implémenté. Les animations de personnage sont représentées par le mouvement de caméra/arme et les réactions ennemies. La carte est une arène unique ; pas encore de sauvegarde, de progression multi-niveaux ni de tests automatisés. Le contrôle est conçu prioritairement pour clavier/souris.
