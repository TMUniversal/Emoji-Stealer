# Emoji Stealer
<div>
	<p align="center">
		<a href="https://github.com/TMUniversal/Emoji-Stealer/blob/stable/package.json#L3">
			<img src="https://img.shields.io/badge/Emoji_Stealer-v0.1.3-c4c4c4.svg?style=flat" />
		</a>
		<a href="https://tmuniversal.eu/discord">
			<img src="https://img.shields.io/discord/727551682090762280.svg?style=flat&logo=discord">
		</a>
		<a href="https://tmuniversal.eu/redirect/patreon">
			<img src="https://img.shields.io/badge/Patreon-support_me-fa6956.svg?style=flat&logo=patreon" />
		</a>
		<br />
		<a href="https://github.com/TMUniversal/Emoji-Stealer/actions">
			<img src="https://github.com/TMUniversal/Emoji-Stealer/workflows/Test/badge.svg" />
		</a>
		<a href="https://github.com/TMUniversal/Emoji-Stealer/issues">
			<img src="https://img.shields.io/github/issues/TMUniversal/Emoji-Stealer.svg?style=flat">
		</a>
		<a href="https://github.com/TMUniversal/Emoji-Stealer/graphs/contributors">
			<img src="https://img.shields.io/github/contributors/TMUniversal/Emoji-Stealer.svg?style=flat">
		</a>
		<a href="https://github.com/TMUniversal/Emoji-Stealer/blob/stable/LICENSE.md">
			<img src="https://img.shields.io/github/license/TMUniversal/Emoji-Stealer.svg?style=flat">
		</a>
	</p>
</div>

# Getting Started

Emoji Stealer is a Discord Bot that allows it's users to copy custom emojis from other guilds. Without downloads.

To use this bot: [invite](https://discord.com/api/oauth2/authorize?client_id=726731461310545920&permissions=1074072576&scope=bot) it to your server, or host it yourself.

## Installation

Assuming you have [Node.js](https://nodejs.org/en/download/current/) installed, install the required packages:
> Please use the latest version on Node.js, as this project is constantly keeping up to date.
> Emoji Stealer is built and tested with the latest version of Node.js

- In the project folder: `npm install`

## Setup

- Make a copy of `data.example.json`, name it `data.json`.
- Fill in the necessary values, remove the comment (since comments are not supported in JSON).
  - `owners` may be an array of strings


```JSON
  {
    "clientToken": "<Discord Bot Token>",
    "webhook": {
      "id": "",
      "secret": ""
    },
    "botstatToken": "<Token>",  // Closed API. Request key (more info on website) or leave empty
    "prefix": ">",
    "owners": "<Your Discord ID>",
    // OR
    "owners": ["<Your Discord ID>", "<Another Discord ID>"]
  }
```

## Starting

To start the bot, it must first be complied.

- Run `npm run build`
- You may then start with `npm start` or, if you have pm2 installed: `pm2 start pm2-start.json`
- Alternatively: Run `npm run cs` to build and then start.

`npm run startmon` will launch the bot in monitor mode, i.e. it will reload anytime you save a file (unfit for production environments).

# Using the bot

## Commands

### Basic

To get help or view information about this bot.

`>help` Shows a list of commands

`>help [command]` Shows help for a specific command

`>about` Information about this bot

`>invite` Generate an invite link, so you can invite this bot to your server

### Copying Emojis

`>steal` Will open up a menu that explains the process.

To steal emojis, simply react to the message the bot sends with the custom emojis you want on your server.

# Credits

Credits to [Hydractify](https://github.com/Hydractify/kanna_kobayashi) for their logging system.

# License

Emoji Stealer is released under the [MIT License](LICENSE.md).