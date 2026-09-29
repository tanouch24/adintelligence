# Ad Intelligence

Plateforme interne de veille publicitaire et d'intelligence créative pour Auryel, CEE / SSC / PAC et Feaseweb.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS 4
- PostgreSQL + Prisma 6.19
- Zod pour la validation runtime des payloads normalisés
- Vitest + tsx pour les tests et le seed

## Démarrage

1. Copier .env.example vers .env et renseigner DATABASE_URL.
2. Installer : npm install.
3. Générer le client : npm run db:generate.
4. Valider le schéma : npm run db:validate.
5. Appliquer les migrations en local : npm run db:migrate.
6. Charger les données de démonstration : npm run db:seed.
7. Lancer l'interface : npm run dev.

Sans PostgreSQL, l'application continue de fonctionner avec ses données MOCK du Lot 1. Les routes API renvoient une erreur 503 explicite lorsque DATABASE_URL n'est pas configuré.

## Architecture de données

prisma/schema.prisma contient les modèles persistants : Project, Advertiser, Ad, Creative, ProjectAd, Watchlist, SwipeFileItem, Analysis, SignalScore, PublicMetrics, AdObservation, GeneratedCreative, OwnAdAccount, OwnCampaign, OwnAdSet, OwnAd et OwnCampaignPerformance.

Les données concurrentes sont séparées des données de nos campagnes par les modèles Ad/PublicMetrics d'un côté et Own* de l'autre. Le ROAS n'existe que sur OwnCampaignPerformance.

Les contraintes importantes sont :

- Ad(platform, externalId) pour l'idempotence d'ingestion ;
- Advertiser(platform, externalId) pour éviter les doublons annonceurs ;
- ProjectAd(projectId, adId) pour la relation many-to-many ;
- SwipeFileItem(projectId, adId) pour empêcher les doublons du Swipe File ;
- AdObservation(adId, observedAt) pour un snapshot d'observation idempotent ;
- Analysis(adId, version) pour versionner les futures analyses IA.

## Pipeline provider

Les providers futurs implémenteront src/providers/contract.ts :

Provider brut → normalizeAd() → validateNormalizedAd() avec Zod → ingestNormalizedAd() → transaction Prisma → upserts de l'annonceur, de l'Ad, des créas, des associations Project/Ad, de l'observation et des métriques publiques.

Aucun provider Meta, TikTok, Google, YouTube ou IA n'est branché dans ce lot.

## Couche data

- src/data/db/prisma.ts : singleton Prisma compatible hot reload.
- src/data/repositories/project-repository.ts
- src/data/repositories/ads-repository.ts
- src/data/repositories/watchlist-repository.ts
- src/data/repositories/swipe-repository.ts
- src/ingestion/service.ts : ingestion transactionnelle normalisée.
- src/app/api/projects/route.ts et src/app/api/ads/route.ts : routes GET minimales, typées et sans exposition de rawPayload.

## Seed et données DEMO

prisma/seed.ts crée les trois projets initiaux, annonceurs, ads, creatives, observations, watchlists et un élément Swipe File. Toutes les valeurs sont explicitement suffixées ou marquées DEMO et utilisent des URLs demo.invalid.

## Commandes qualité

- npm run lint
- npm run typecheck
- npm test
- npm run build

## Variables

Seule DATABASE_URL est nécessaire pour PostgreSQL. Les variables futures des providers ne sont pas ajoutées à ce lot. Aucun secret ne doit être commité ; .env est ignoré par Git.
