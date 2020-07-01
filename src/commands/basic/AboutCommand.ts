/* eslint-disable no-unused-vars */
import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { MessageEmbed } from '../../structures/MessageEmbed'
const pkg = require('../../../package.json')

export default class PingCommand extends Command {
  public constructor () {
    super('about', {
      aliases: ['about'],
      category: 'basic',
      description: {
        content: 'Show information about this bot',
        usage: 'about',
        examples: [
          'about'
        ]
      },
      ratelimit: 3
    })
  }

  public exec (message: Message): Promise<Message> {
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=1074072576&scope=bot`
    return message.util.send(new MessageEmbed({
      title: 'About ' + this.client.user.username,
      url: 'https://top.gg/bot/726731461310545920',
      description: `Hello! I'm ${this.client.user.username}, a discord bot that's also a thief!` +
          '\nI am here to help you get those sweet emojis other servers have, without you having to download a thing!' +
          '\n ' +
          '\nAs I am still a work in progress, errors may occur. Report any issues to the repository (see below) or ' +
          'DM my creator on Discord.' +
          '\nYou can also join the [support server](https://discord.gg/vy8tUdX).\n',
      color: 0xc4c4c4,
      thumbnail: {
        url: this.client.user.avatarURL({ dynamic: true })
      },
      fields: [{
        name: 'Developed by',
        value: 'Universal Studio™#0001 | GitHub: [TMUniversal](https://github.com/tmuniversal)',
        inline: false
      },
      {
        name: 'Emoji Stealer',
        value: `Version: ${pkg.version}` +
              '\nWritten in TypeScript, powered by Node.js',
        inline: false
      },
      {
        name: 'Useful Links',
        value: '[GitHub](https://github.com/TMUniversal/Emoji-Stealer)' +
        '\n[TM Universal](https://github.com/TMUniversal)' +
        `\n[Invite me](${inviteLink})`,
        inline: true
      },
      {
        name: 'Built With',
        value: '[Discord.js](https://github.com/discordjs/discord.js#readme)' +
              '\n[Discord Akairo](https://github.com/discord-akairo/discord-akairo#readme)' +
              '\nHard Work™',
        inline: true
      }],
      timestamp: new Date(),
      footer: {
        icon_url: this.client.user.avatarURL({ dynamic: true }),
        text: 'Emoji Stealer by TMUniversal (MIT License)'
      }
    }))
  }
}
