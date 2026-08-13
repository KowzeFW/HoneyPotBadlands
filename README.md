<h1 align="center">
  Honey Pot Badlands
  <br>
</h1>

<h4 align="center">Un bot Discord qui protège un salon contre les messages non autorisés.</h4>

<p align="center">
  <a href="https://github.com/KowzeFW/HoneyPotBadlands/blob/main/LICENSE"><img alt="Licence : MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
  <a href="https://discord.js.org/"><img alt="Discord.js" src="https://img.shields.io/badge/discord.js-v14-5865F2.svg"></a>
  <a href="https://nodejs.org/"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-24%2B-339933.svg"></a>
  <a href="https://biomejs.dev/"><img alt="Style de code : Biome" src="https://img.shields.io/badge/linting-Biome-60A5FA.svg"></a>
</p>

<p align="center">
  <a href="#description">Description</a> •
  <a href="#installation">Installation</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#utilisation">Utilisation</a> •
  <a href="#permissions-discord">Permissions Discord</a>
</p>

## Description

**HoneyPotBadlands** protège un salon Discord : tout message d'un utilisateur non autorisé y est supprimé et son auteur expulsé du serveur. Une liste blanche exempte les utilisateurs de confiance.

## Installation

```bash
git clone https://github.com/KowzeFW/HoneyPotBadlands.git
cd HoneyPotBadlands
npm install
cp .env.example .env
```

Prérequis : Node.js 24+, un bot Discord et un serveur sur lequel l'installer.

## Configuration

Renseignez ces variables dans `.env` :

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Token de votre bot Discord |
| `CHANNEL_ID` | ID du salon à protéger |
| `WHITELIST` | IDs des utilisateurs autorisés, séparés par des virgules |

## Utilisation

```bash
npm start
```

Le bot surveille automatiquement le salon configuré : les utilisateurs de la liste blanche peuvent écrire librement, les autres voient leur message supprimé et sont expulsés.

## Permissions Discord

**Permissions du bot** : Voir les salons, Voir les anciens messages, Envoyer des messages, Gérer les messages, Expulser des membres.

**Intents à activer** (Discord Developer Portal) : `Server Members Intent`, `Message Content Intent`.

**Intents utilisés par le bot** : `Guilds`, `GuildMessages`, `GuildMembers`, `MessageContent`.