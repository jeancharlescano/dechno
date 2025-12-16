# Configuration n8n pour Notion et Discord

Ce guide explique comment configurer n8n pour recevoir les articles de Dechno et les envoyer vers Notion et Discord.

## 📋 Prérequis

1. Une instance n8n (self-hosted ou cloud)
2. Un compte Notion avec une base de données pour les articles
3. Un serveur Discord avec un webhook configuré

## 🚀 Installation du workflow

### Étape 1 : Importer le workflow dans n8n

1. Copiez le contenu de `docs/n8n-workflow.json`
2. Dans n8n, cliquez sur "+" → "Import from File" ou "Import from URL"
3. Collez le JSON du workflow

### Étape 2 : Configurer Notion

#### 2.1 Créer la base de données Notion

Créez une base de données Notion avec les propriétés suivantes :

| Nom de la propriété | Type | Description |
|---------------------|------|-------------|
| Titre | Title | Titre de l'article (propriété par défaut) |
| URL | URL | Lien vers l'article |
| Auteur | Text | Nom de l'auteur |
| Date de publication | Date | Date de publication |
| Source | Select | Options: "RSS Feed", "Manual", etc. |
| Status | Select | Options: "À lire", "Lu", "Archivé" |

#### 2.2 Connecter Notion à n8n

1. Dans le node "Ajouter à Notion", cliquez sur "Credentials"
2. Créez une nouvelle credential Notion
3. Suivez le processus d'authentification OAuth
4. Sélectionnez votre base de données dans le champ "Database"

#### 2.3 Ajuster les propriétés

Dans le node "Ajouter à Notion" → "Properties", vérifiez que les noms correspondent exactement à votre base de données :
- `URL` → Le nom de votre propriété URL
- `Auteur` → Le nom de votre propriété Auteur
- etc.

### Étape 3 : Configurer Discord

#### 3.1 Créer un webhook Discord

1. Allez dans les paramètres de votre serveur Discord
2. Intégrations → Webhooks → Nouveau webhook
3. Nommez-le "Dechno RSS" et choisissez le canal
4. Copiez l'URL du webhook

#### 3.2 Configurer le node Discord

1. Dans le node "Envoyer sur Discord"
2. Collez votre URL de webhook dans le champ "URL"
3. Le format du message est déjà configuré avec un bel embed

### Étape 4 : Activer le workflow

1. Activez le workflow en cliquant sur le toggle en haut à droite
2. Copiez l'URL du webhook (visible dans le node Webhook)
3. L'URL sera du format : `https://your-n8n.com/webhook/825ef053-69fa-468d-ba1c-7e642ed95722`

### Étape 5 : Configurer Dechno

1. Dans votre projet Dechno, créez `.env.local` :
```bash
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/825ef053-69fa-468d-ba1c-7e642ed95722
```

2. Redémarrez votre serveur de développement

## 🎨 Personnalisation

### Modifier le format Discord

Dans le node "Envoyer sur Discord", vous pouvez personnaliser :

**Couleur de l'embed** : Changez `"color": 5814783` (actuellement vert sauge)
- Bleu : `3447003`
- Rouge : `15158332`
- Vert : `3066993`

**Champs supplémentaires** : Ajoutez dans `"fields"` :
```json
{
  "name": "🏷️ Catégorie",
  "value": "Technologie",
  "inline": true
}
```

### Ajouter des filtres

Vous pouvez ajouter un node "IF" entre le Webhook et Notion/Discord pour :
- Filtrer par auteur
- Filtrer par mots-clés dans le titre
- Limiter aux articles récents uniquement

Exemple :
```
{{ $json.body.title.includes('tech') || $json.body.title.includes('AI') }}
```

## Données envoyées par Dechno

L'application envoie les données suivantes au webhook n8n :

```json
{
  "title": "Titre de l'article",
  "link": "https://example.com/article",
  "author": "Nom de l'auteur",
  "pubDate": "2024-01-01T00:00:00.000Z",
  "content": "Résumé de l'article...",
  "image": "https://example.com/image.jpg",
  "guid": "unique-article-id"
}
```

## Test

1. Assurez-vous que votre workflow n8n est actif
2. Dans Dechno, cliquez sur le bouton d'envoi (icône Send) en haut à droite d'une card d'article
3. Vérifiez que l'article apparaît dans votre Notion et Discord

## Dépannage

- **Erreur 500**: Vérifiez que `N8N_WEBHOOK_URL` est défini dans `.env.local`
- **Webhook ne reçoit pas les données**: Vérifiez que le workflow n8n est actif
- **Données manquantes**: Certains flux RSS peuvent ne pas inclure tous les champs (image, auteur, etc.)
