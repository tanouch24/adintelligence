# Ad Intelligence

Socle interne de veille publicitaire, Ad Intelligence et Creative Intelligence pour Auryel, CEE / SSC / PAC et Feaseweb. Le projet est volontairement indépendant des autres projets de la machine.

## Stack

- Next.js 16 avec App Router
- React 19, TypeScript strict
- Tailwind CSS 4
- ESLint
- Architecture compatible PostgreSQL et déploiement futur Vercel / Railway / Netlify

## Lancer localement

Lancer npm install puis npm run dev, puis ouvrir http://localhost:3000.

## Structure

- src/app : routes et shell UI
- src/domain : modèles métier et données de démonstration
- src/providers : frontière réservée aux futures intégrations
- .env.example : variables futures, sans secret

## Lot 1

Le Dashboard et Ad Explorer sont disponibles. Les chiffres, publicités, créas, métriques publiques, tendances et watchlists sont exclusivement MOCK et clairement signalés. Les boutons d'analyse, de génération et de connexion sont des points d'extension UI.

Ne sont pas implémentés : API Meta / TikTok / Google / YouTube, API IA, base PostgreSQL, authentification, stockage média, synchronisations, métriques propriétaires et génération de créas.

## Architecture métier préparée

Project, Platform, Advertiser, Ad, Creative, Watchlist, Analysis, GeneratedCreative et OwnCampaignPerformance sont définis dans src/domain/models.ts. Les performances propriétaires sont distinctes des signaux observables concurrents : aucun signal ne prétend représenter le ROAS ou la rentabilité.

## Suite recommandée — Lot 2

1. Choisir PostgreSQL + ORM et définir les migrations.
2. Ajouter l'authentification et le multi-projet.
3. Implémenter un premier provider Meta avec ingestion idempotente et normalisation.
4. Remplacer progressivement les mocks de l'Explorer par des requêtes paginées.
5. Ajouter stockage média, historique de détection et audit des imports.
