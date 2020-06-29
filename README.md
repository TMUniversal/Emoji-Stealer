# Emoji Stealer

![Test](https://github.com/TMUniversal/Emoji-Stealer/workflows/Test/badge.svg)

[Invite](https://discord.com/api/oauth2/authorize?client_id=726731461310545920&permissions=1074072576&scope=bot) the bot to your server.

## Installation

Run `npm install`

## Setup

- Make a copy of `data.example.json`, name it `data.json`.
- Fill in the necessary values, remove the comment (since comments are not supported in JSON).
  - `owners` may be an array of strings

## Starting

To start the bot, it must first be complied.

- Run `npm run build`
- You may then start with `npm start` or, if you have pm2 installed: `pm2 start pm2-start.json`
- Alternatively: Run `npm run cs` to build and then start.

`npm run startmon` will launch the bot in monitor mode, i.e. it will reload anytime you save a file.

# Credits

Credits to [Hydractify](https://github.com/Hydractify/kanna_kobayashi) for their logging system.
