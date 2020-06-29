/* eslint-disable no-unused-vars */
import { Command } from 'discord-akairo'
import { Message, MessageReaction, User, GuildEmoji } from 'discord.js'
import axios from 'axios'
import { MessageEmbed } from '../../structures/MessageEmbed'

export default class StealCommand extends Command {
  public constructor () {
    super('steal', {
      aliases: ['steal'],
      category: 'emoji stealer',
      description: {
        content: 'Steal emojis by reacting with them.',
        usage: 'steal',
        examples: [
          'steal'
        ]
      },
      ratelimit: 3,
      typing: true,
      userPermissions: ['MANAGE_EMOJIS']
    })
  }

  public async exec (message: Message): Promise<Message> {
    return message.util.send(MessageEmbed.common({ author: message.author })
      .setTitle('Emoji Stealer')
      .setDescription('To "steal" emojis, react to this message with any custom emojis (may require Discord Nitro).\nI will upload emoji to this guild for the next 30 seconds.'))
      .then(async m => {
        return m.awaitReactions(this.filter, { time: 30000 })
          .then(async collected => {
            const emojis = collected.filter(emoji => emoji.users.cache.has(message.author.id))
            if (emojis.size < 1) return message.util.reply('You\'re supposed to add reactions... Please try again...')
            for (const [key, reaction] of emojis) {
              const response = await axios.get(reaction.emoji.url, { responseType: 'arraybuffer' })
              const image = Buffer.from(response.data, 'utf-8')
              message.guild.emojis.create(image, reaction.emoji.name, { reason: `Requested by: ${message.author.tag}` })
              return message.util.reply('Emojis uploaded.')
            }
          })
          .catch(() => { return message.util.reply('Something\'s not right, I can feel it.') })
      })
  }

  private filter (reaction: MessageReaction, user: User): boolean {
    if (!reaction.emoji.url) return false // Emoji won't be uploadable
    if (reaction.partial) {
      reaction.fetch().then(r => {
        const emoji: GuildEmoji = r.emoji as GuildEmoji
        if (emoji.guild.id === r.message.guild.id) return false // Emoji is from this guild
        return true
      })
    } else {
      const emoji: GuildEmoji = reaction.emoji as GuildEmoji
      if (emoji.guild?.id === reaction.message.guild.id) return false // Emoji is from this guild
      return true
    }
  }
}
