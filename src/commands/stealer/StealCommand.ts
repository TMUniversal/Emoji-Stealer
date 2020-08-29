import { Command } from 'discord-akairo'
import { Message, MessageReaction, User, GuildEmoji } from 'discord.js'
import axios from 'axios'
import { MessageEmbed } from '../../structures/MessageEmbed'
import { WebhookLogger } from '../../structures/WebhookLogger'

export default class StealCommand extends Command {
  private logger = WebhookLogger.instance
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
      userPermissions: ['MANAGE_EMOJIS'],
      clientPermissions: ['MANAGE_EMOJIS']
    })
  }

  public async exec (message: Message): Promise<Message | void> {
    if (!message.guild) return message.util.reply('This command can only work in servers.')
    return message.util.send(MessageEmbed.common({ author: message.author })
      .setTitle('Emoji Stealer')
      .setDescription('**To *steal* emojis, react to this message with any custom emojis** (this requires Discord Nitro).\n\n' +
          'I will give you 30 seconds to choose, then upload your chosen custom emojis to this guild.'))
      .then(async m => {
        // Collect reactions
        return m.awaitReactions(this.filter, { time: 32500 })
          .then(async collected => {
            const reactions = collected.filter(emoji => emoji.users.cache.has(message.author.id))
            if (reactions.size < 1) return message.util.reply('you\'re supposed to add custom emojis... Please try again...')
            for (const [, reaction] of reactions) {
              message.guild.emojis.create((await axios.get(reaction.emoji.url, { responseType: 'arraybuffer' })).data, reaction.emoji.name, { reason: `Requested by: ${message.author.tag} (${message.author.id})` })
                .then(() => this.client.counter.updateEmojiCount())
                .catch(() => {
                  message.channel.send('Could not upload emoji: ' + reaction.emoji.name)
                  this.logger.error('EMOJI UPLOAD', `Could not upload emoji: ${reaction.emoji.name} (${reaction.emoji.id})`)
                })
            }
            return message.util.reply('done.')
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
