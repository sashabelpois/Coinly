# Configuration du Postback CPX Research

## URL du Postback

Dans votre dashboard CPX Research, configurez l'URL suivante :

```
https://votre-domaine.com/api/postbacks/cpx?status={status}&trans_id={trans_id}&user_id={user_id}&sub_id={subid}&sub_id_2={subid_2}&amount_local={amount_local}&amount_usd={amount_usd}&offer_id={offer_ID}&hash={secure_hash}&ip_click={ip_click}
```

Pour le développement local (avec ngrok ou similaire) :
```
http://localhost:3001/api/postbacks/cpx?status={status}&trans_id={trans_id}&user_id={user_id}&sub_id={subid}&sub_id_2={subid_2}&amount_local={amount_local}&amount_usd={amount_usd}&offer_id={offer_ID}&hash={secure_hash}&ip_click={ip_click}
```

## Paramètres du Postback

### Obligatoires
- `{amount_local}` : Montant en EUR
- `{amount_usd}` : Montant en USD
- `{user_id}` : ID de l'utilisateur

### Recommandés
- `{status}` : 1 = completed, 2 = canceled/reversed
- `{trans_id}` : ID unique de la transaction

### Optionnels
- `{subid}` : Votre sub_id_1
- `{subid_2}` : Votre sub_id_2
- `{offer_ID}` : ID de l'offre
- `{secure_hash}` : Hash de sécurité (md5({trans_id}-{app_secure_hash}))
- `{ip_click}` : IP du clic utilisateur
- `{type}` : Type (out, complete, bonus)

## Whitelist IP

Ajoutez ces IPs à votre firewall si nécessaire :
- `188.40.3.73`
- `2a01:4f8:d0a:30ff::2`
- `157.90.97.92`

## Types de Postbacks

### Main Postback URL
Appelé pour tous les événements :
- User Complete a Survey
- User screened out
- User Rate a survey

### Screen Out Postback (Expert Settings)
Si configuré, le Main Postback n'est plus appelé pour les screen outs.

### Bonus/Rating Postback (Expert Settings)
Pour les bonus et ratings.

### Event Canceled Postback (Expert Settings)
Pour les événements annulés.

## Vérification du Hash

Le système vérifie automatiquement le hash :
```
md5({trans_id}-{CPX_SECURE_HASH})
```

Assurez-vous que `CPX_SECURE_HASH` est configuré dans votre `.env`.

## Gestion des Statuts

- **Status = 1** : Transaction complétée → Coins crédités
- **Status = 2** : Transaction annulée → Coins débités si déjà crédités

## Gestion des Types

- **complete** : Sondage complété → Traité
- **bonus** : Bonus → Traité
- **out** : Screen out → Ignoré (sauf si status = 1)

## Exemple de Postback Reçu

```
GET /api/postbacks/cpx?status=1&trans_id=12345&user_id=user-abc&amount_local=0.50&amount_usd=0.54&hash=abc123...
```

Le système :
1. Vérifie le hash
2. Crée/update l'offre avec le montant réel
3. Crédite les coins à l'utilisateur
4. Enregistre la conversion

