# llehunixwebsite

Ce dépôt contient le code source de mon portfolio personnel.

## Lancer avec Docker

Construire l'image Docker depuis la racine du projet :

```bash
docker build -t llehunixwebsite .
```

Lancer le conteneur :

```bash
docker run --name llehunixwebsite -p 3000:3000 llehunixwebsite
```

Le portfolio sera disponible à l'adresse
[http://localhost:3000](http://localhost:3000).

Pour arrêter et supprimer le conteneur :

```bash
docker stop llehunixwebsite
docker rm llehunixwebsite
```

---

## I build stuff.
