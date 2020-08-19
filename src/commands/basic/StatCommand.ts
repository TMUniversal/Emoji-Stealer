import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import config from '../../config'
import { MessageEmbed } from '../../structures/MessageEmbed'
import moment from 'moment'

export default class StatCommand extends Command {
  public constructor () {
    super('stats', {
      aliases: ['stats', 'statistics', 'metrics'],
      category: 'basic',
      description: {
        content: 'Check some numbers',
        usage: 'stats',
        examples: [
          'stats'
        ]
      },
      ratelimit: 3,
      cooldown: 10 * 1000,
      typing: true
    })
  }

  public async exec (message: Message): Promise<Message> {
    const errMsg = 'Error while fetching'
    const data = await this.getData()
    return message.util.send(new MessageEmbed()
      .setAuthor(`${this.client.user.username} Stats`, this.client.user.avatarURL({ dynamic: true }))
      .setDescription('Here are some statistics of the bot')
      .setThumbnail(this.client.user.avatarURL({ dynamic: true }))
      .addFields([
        {
          name: 'Uptime',
          value: data.uptime,
          inline: true
        },
        {
          name: 'Memory Usage',
          value: `${data.memory} MB`,
          inline: true
        },
        {
          name: `${this.client.user.username} serves`,
          value: `${data.guilds} Servers\n` +
            `With ${data.shards} Shards\n` +
            `Users: ${data.users}`,
          inline: true
        },
        {
          name: 'Uploads',
          value: `Emojis Stolen: ${data.emojisUploaded}${data.stealCmdUses ? ` with ${data.stealCmdUses} uses` : ''}\n` +
            `Profile Pictures: ${data.pfpsUploaded}`,
          inline: true
        }
      ])
      .setFooter(`${this.client.user.username} Version ${data.version}`)
      .setTimestamp()
    )
  }

  private async getData () {
    let emojisUploaded: number
    let stealCmdUses: number
    let pfpsUploaded: number
    try {
      emojisUploaded = await this.client.counter.getEmojiCount()
      stealCmdUses = (await this.client.wrapper?.statistics.getCommand(this.client.user.id, 'steal'))?.uses
      pfpsUploaded = await this.client.counter.getPfpCount()
    } catch (err) {
      console.error(err)
    }
    return {
      guilds: this.client.guilds.cache.size,
      users: this.client.users.cache.size,
      uptime: moment.utc(this.client.uptime).format('DDD[d] HH[h] mm[m] ss[s]'),
      emojisUploaded,
      stealCmdUses,
      pfpsUploaded,
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      version: config.version,
      shards: this.client.shard?.ids.length || 1
    }
  }
}
