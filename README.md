# Emoji Stealer

<div>
  <p align="center">
    <a href="https://github.com/TMUniversal/Emoji-Stealer/blob/master/package.json#L3">
      <img src="https://img.shields.io/github/package-json/v/TMUniversal/Emoji-Stealer?style=flat&color=c4c4c4" />
    </a>
    <a href="https://tmuniversal.eu/redirect/discord">
      <img src="https://img.shields.io/discord/727551682090762280.svg?style=flat&logo=discord">
    </a>
    <a href="https://tmuniversal.eu/redirect/patreon">
      <img src="https://img.shields.io/badge/Patreon-support_me-fa6956.svg?style=flat&logo=patreon" />
    </a>
    <br />
    <a href="https://github.com/TMUniversal/Emoji-Stealer/actions">
      <img src="https://github.com/TMUniversal/Emoji-Stealer/workflows/Test/badge.svg" />
    </a>
    <a href="https://www.codacy.com/manual/Uni/Emoji-Stealer?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=TMUniversal/Emoji-Stealer&amp;utm_campaign=Badge_Grade">
      <img src="https://app.codacy.com/project/badge/Grade/5d164400a96e44f1bac77bcdfeb1f883"/>
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

## Getting Started

[Emoji Stealer] is a Discord Bot that allows it's users to copy custom emojis from other guilds. Without downloads.

### This project is no longer in development and the bot has been shut down.

To use this bot, you must host it yourself.

Useful reading: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot

## Installation

Assuming you already have [Node.js] installed, install the required packages:

> Please use the latest version on Node.js, as this project is constantly keeping up to date.
> Emoji Stealer is built and tested with the latest version of Node.js

This project uses [yarn].

If you do not have yarn installed you can install it from their website or via npm: `npm install -g yarn`

In the project folder, run `yarn install`

##### Potential issues during installation

On linux you may need additional dependencies (on ubuntu: `automake`) for the image compression packages imagemin and addons. Not individually installing the [`imagemin`] packages (only with npm, **yarn does not have this issue**) has lead to errors on Ubuntu, see this [issue](https://github.com/TMUniversal/Emoji-Stealer/issues/31#issuecomment-664607038).

## Setup

- Make a copy of [`data.example.json`], name it `data.json`.
- Fill in the necessary values.
  - `owners` may be an array of strings

```JS
  {
    "clientToken": "<Discord Bot Token>",
    "webhook": { // The bot will send logs to this discord webhook.
      "id": "",
      "secret": ""
    },
    "weebToken": "<Token>",  // Closed API. Request key (more info on website) or leave empty
    "dblToken": "<Another token>", // Your top.gg api key. Used to upload stats.
    "prefix": ">",
    "owners": "<Your Discord ID>",
    "userBlacklist": ["<some id>"], // users that cannot use commands
    "counter": { // persisting counters with countapi.xyz (may need manual creation). This counts the amount of emojis and profile pictures the bot has successfully uploaded.
      "namespace": "",
      "emojiKey": "",
      "pfpKey": ""
    }
  }
```

## Starting

To start the bot, the code must first be complied.

- Run `yarn build`
- You may then start with `yarn start` or, if you have pm2 installed: `pm2 start pm2-start.json`
- Alternatively: Run `yarn run cs` to build and then start.
- This bot can easily be started with docker: `./scripts/docker.sh build`; `./scripts/docker.sh help` for more information.

## Updating

To automatically get the latest updates and rebuild the code, use the update script: `./scripts/update.sh`

Warning: The script will reset your local repository.

After pulling the latest code (on your current branch), the script will re-build the source code.

You have to restart your application, the script will not do that for you.

## Using the bot

### Commands

#### Basic

To get help or view information about this bot.

`>help` Shows a list of commands

`>help [command]` Shows help for a specific command

`>about` Information about this bot

`>invite` Generate an invite link, so you can invite this bot to your server

#### Copying Emojis

`>steal` Will open up a menu that explains the process.

To steal emojis, simply react to the message the bot sends with the custom emojis you want on your server.

<details>

<summary>Image guide. (click to open)</summary>

<img src="https://i.imgur.com/fs8jicD.png" />

<img src="https://i.imgur.com/fh4ZGeZ.png?1" />

<img src="https://i.imgur.com/kGpbUe4.png" />

<img src="https://i.imgur.com/IZTFiIA.png" />

</details>

`>pfp [@user]` Will upload the profile picture of the mentioned user as an emoji _(mentioning a user is optional, if omitted this will upload your own profile picture)_

## Credits

Credits to [Hydractify] for their logging system.

## License

Emoji Stealer is released under the [MIT License](LICENSE.md).

<!-- Getting started -->

[emoji stealer]: https://github.com/TMUniversal/Emoji-Stealer

<!-- Installation -->

[`imagemin`]: https://www.npmjs.com/package/imagemin
[node.js]: https://nodejs.org/en/download/current/
[yarn]: https://classic.yarnpkg.com/en/docs/install/

<!-- Setup -->

[`data.example.json`]: https://github.com/TMUniversal/Emoji-Stealer/blob/master/data.example.json

<!-- Credits -->

[hydractify]: https://github.com/Hydractify/kanna_kobayashi
