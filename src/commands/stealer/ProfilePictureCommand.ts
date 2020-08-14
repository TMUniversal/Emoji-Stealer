import { Command } from 'discord-akairo'
import { Message, MessageReaction, MessageAttachment, User, GuildEmoji } from 'discord.js'
import axios from 'axios'
import { MessageEmbed } from '../../structures/MessageEmbed'
import compress from '../../util/ImageCompressor'
import { WebhookLogger } from '../../structures/WebhookLogger'
import { validEmojiName } from '../../util/Validators'

export default class ProfilePictureCommand extends Command {
  logger: WebhookLogger
  public constructor () {
    super('pfp', {
      aliases: ['pfp', 'stealprofile'],
      category: 'emoji stealer',
      description: {
        content: 'Turn someone\'s profile picture into an emoji.',
        usage: 'pfp [@user]',
        examples: [
          'pfp',
          'pfp @Emoji Stealer#2863',
          'pfp @your name here#1234'
        ]
      },
      ratelimit: 3,
      userPermissions: ['MANAGE_EMOJIS'],
      clientPermissions: ['MANAGE_EMOJIS']
    })
    this.logger = WebhookLogger.instance
  }

  public async exec (message: Message): Promise<Message> {
    if (!message.guild) return message.util.reply('This command can only work in servers.')
    const targetUser = message.mentions.users.first() || message.author

    // Download their PFP
    const avatarUrl = targetUser.avatarURL({ format: 'png', size: 256 })
    if (typeof avatarUrl !== 'string') return message.util.send(`It seems ${targetUser} has no profile picture to steal...`)
    const pfp = Buffer.from((await axios.get(avatarUrl, { responseType: 'arraybuffer' })).data, 'utf-8') // TODO: Allow gifs

    const image = await compress(pfp)

    const emojiName = validEmojiName(targetUser.username)

    message.util.send({ content: `Uploading the following image as \`${emojiName}\`${emojiName === 'invalid_name' ? `, because ${targetUser.username} is not a valid name for an emoji.` : ''}:`, files: [new MessageAttachment(image)] })

    return message.guild.emojis.create(image, emojiName, { reason: `Requested by: ${message.author.tag}` })
      .then(emoji => {
        this.client.counter.updatePfpCount()
        return message.util.send(`Done. <:${emoji.name}:${emoji.id}>`)
      })
      .catch((e) => {
        this.logger.error('PFP UPLOAD', e)
        return message.channel.send('Could not upload!') // TODO: report what went wrong in more detail.
      })
  }
}
