# 🚀 Guide rapide n8n - 5 minutes

## 1️⃣ Importez le workflow (30 secondes)

1. Ouvrez n8n
2. Cliquez sur **"+"** puis **"Import from Clipboard"**
3. Copiez-collez le contenu de `docs/n8n-workflow.json`
4. Cliquez sur **"Import"**

## 2️⃣ Configurez Notion (2 minutes)

### Créez votre base de données Notion :

**Template rapide** : Créez une nouvelle page dans Notion, ajoutez une base de données avec :

```
┌─────────────────────────────────────────────────┐
│ 📰 Articles RSS                                 │
├─────────────┬──────────┬──────────────────────┤
│ Titre       │ URL      │ Auteur               │
│ (Title)     │ (URL)    │ (Text)               │
├─────────────┼──────────┼──────────────────────┤
│ Date        │ Source   │ Status               │
│ (Date)      │ (Select) │ (Select)             │
└─────────────┴──────────┴──────────────────────┘
```

**Options pour "Source"** : RSS Feed, Manual
**Options pour "Status"** : À lire, Lu, Archivé

### Connectez n8n à Notion :

1. Dans le node **"Ajouter à Notion"**
2. Cliquez sur **"Select Credential"** → **"Create New"**
3. Cliquez sur **"Connect my account"**
4. Autorisez n8n à accéder à Notion
5. Sélectionnez votre base de données dans la liste

## 3️⃣ Configurez Discord (1 minute)

1. Ouvrez votre serveur Discord
2. **Paramètres du serveur** → **Intégrations** → **Webhooks**
3. Cliquez sur **"Nouveau webhook"**
4. Nommez-le **"Dechno RSS"**
5. Choisissez le canal (ex: #actualités)
6. Cliquez sur **"Copier l'URL du webhook"**

Dans n8n :
1. Ouvrez le node **"Envoyer sur Discord"**
2. Collez l'URL dans le champ **"URL"**

## 4️⃣ Activez et testez (1 minute)

1. **Activez** le workflow (toggle en haut à droite)
2. Cliquez sur le node **"Webhook"**
3. Copiez l'**"URL de production"** (ex: `https://n8n.williamloree.fr/webhook/825ef053-...`)
4. Dans votre projet Dechno, créez `.env.local` :

```bash
N8N_WEBHOOK_URL=https://n8n.williamloree.fr/webhook/825ef053-69fa-468d-ba1c-7e642ed95722
```

5. Redémarrez Dechno : `npm run dev`

## 5️⃣ Testez ! (30 secondes)

1. Ouvrez Dechno dans votre navigateur
2. Cliquez sur l'icône **Send** (📤) sur une card d'article
3. Vérifiez :
   - ✅ L'article apparaît dans Notion
   - ✅ Un message apparaît dans Discord
   - ✅ Le bouton devient vert avec un ✓

## ❌ Dépannage rapide

| Problème | Solution |
|----------|----------|
| Bouton devient rouge (✗) | Vérifiez que le workflow n8n est **activé** |
| Rien n'apparaît dans Notion | Vérifiez les noms des propriétés (sensibles à la casse) |
| Discord ne reçoit rien | Vérifiez l'URL du webhook Discord |
| Erreur 500 | Vérifiez que `N8N_WEBHOOK_URL` est dans `.env.local` |

## 🎯 C'est tout !

Vous pouvez maintenant envoyer n'importe quel article RSS vers Notion et Discord en un clic !

## 📚 Pour aller plus loin

- Consultez `docs/N8N_SETUP.md` pour la personnalisation avancée
- Ajoutez des filtres pour ne garder que certains articles
- Modifiez les couleurs et le format des messages Discord
