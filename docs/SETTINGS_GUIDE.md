# Guide de la page Paramètres

La page Paramètres de Dechno vous permet de configurer votre application selon vos besoins.

## 📍 Accès aux paramètres

Cliquez sur l'icône **⚙️ Paramètres** dans le header (en haut à droite) pour accéder à la page de configuration.

## ⚙️ Sections disponibles

### 1. Webhook n8n

Configuration de l'intégration avec n8n pour envoyer les articles vers Notion et Discord.

#### URL du Webhook n8n
- **Description**: L'URL complète de votre webhook n8n
- **Format**: `https://your-n8n-instance.com/webhook/your-webhook-id`
- **Comment l'obtenir**:
  1. Ouvrez votre workflow n8n
  2. Cliquez sur le node "Webhook"
  3. Copiez l'URL de production

#### Envoi automatique
- **Description**: Envoyer automatiquement tous les nouveaux articles vers n8n
- **Valeur par défaut**: Désactivé
- **Note**: Quand activé, chaque article chargé sera automatiquement envoyé (peut générer beaucoup de notifications)

#### Bouton "Tester le webhook"
- Envoie un article de test vers votre webhook n8n
- Permet de vérifier que la configuration fonctionne
- Vérifiez Notion et Discord après le test

### 2. Affichage

Personnalisation de l'affichage des articles.

#### Articles par page
- **Options**: 10, 20, 50, 100 articles
- **Valeur par défaut**: 20 articles
- **Impact**: Nombre d'articles affichés simultanément sur la page d'accueil

### 3. Gestion des données

Outils pour gérer vos données sauvegardées.

#### Nombre de flux RSS enregistrés
- Affiche le nombre total de flux RSS que vous avez ajoutés
- Indicateur visuel de votre utilisation

#### Supprimer tous les flux
- **⚠️ Action irréversible**
- Supprime tous vos flux RSS enregistrés
- Demande une confirmation avant d'exécuter
- Les flux par défaut seront rechargés au prochain démarrage

#### Réinitialiser les paramètres
- Restaure tous les paramètres aux valeurs par défaut
- **Ne supprime pas** vos flux RSS
- Réinitialise :
  - URL du webhook n8n (vide)
  - Envoi automatique (désactivé)
  - Articles par page (20)

## 💾 Sauvegarde

Tous les paramètres sont sauvegardés automatiquement dans le **localStorage** de votre navigateur :
- Pas besoin de compte utilisateur
- Les paramètres persistent entre les sessions
- Spécifiques à votre navigateur et appareil

**Important**: Si vous videz les données de votre navigateur, vos paramètres seront perdus.

## 🔄 Workflow recommandé

### Configuration initiale

1. **Configurez n8n** (une seule fois)
   - Suivez le guide [QUICK_START_N8N.md](QUICK_START_N8N.md)
   - Obtenez votre URL de webhook

2. **Configurez Dechno**
   - Allez dans Paramètres
   - Collez l'URL du webhook n8n
   - Cliquez sur "Tester le webhook"
   - Vérifiez que ça fonctionne
   - Cliquez sur "Enregistrer"

3. **Utilisez l'application**
   - Les articles ont maintenant un bouton 📤 pour envoyer vers n8n
   - Optionnel: Activez l'envoi automatique si vous le souhaitez

### Utilisation quotidienne

- **Mode manuel** (recommandé):
  - Parcourez vos articles
  - Cliquez sur 📤 pour les articles intéressants
  - Ils apparaissent dans Notion/Discord

- **Mode automatique**:
  - Activez "Envoyer automatiquement..."
  - Tous les articles sont envoyés dès le chargement
  - Utile pour l'archivage complet

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| "Webhook URL not configured" | Configurez l'URL dans Paramètres |
| Le test du webhook échoue | Vérifiez que le workflow n8n est activé |
| Les paramètres ne se sauvent pas | Vérifiez que le localStorage est autorisé dans votre navigateur |
| Bouton 📤 ne fait rien | Vérifiez l'URL du webhook dans les Paramètres |

## 🔒 Sécurité et confidentialité

- **Données locales**: Tous les paramètres sont stockés localement dans votre navigateur
- **Pas de serveur**: Aucune donnée n'est envoyée à un serveur Dechno
- **Webhook**: L'URL du webhook est visible dans votre code source (ne partagez pas votre URL publiquement)
- **Recommandation**: Utilisez un webhook n8n avec authentification si nécessaire

## 📝 Paramètres par défaut

```javascript
{
  n8nWebhookUrl: "",
  autoSendToN8n: false,
  theme: "light",
  articlesPerPage: 20
}
```
