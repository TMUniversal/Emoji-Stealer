import { Command } from 'discord-akairo'
import { Message, MessageReaction, MessageAttachment, User, GuildEmoji } from 'discord.js'
import axios from 'axios'
import { MessageEmbed } from '../../structures/MessageEmbed'
import compress from '../../util/ImageCompressor'
import { WebhookLogger } from '../../structures/WebhookLogger'

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
          'pfp @Universal Studio™#0001',
          'pfp @your name here#1234'
        ]
      },
      ratelimit: 3,
      userPermissions: ['MANAGE_EMOJIS']
    })
    this.logger = WebhookLogger.instance
  }

  public async exec (message: Message): Promise<Message | GuildEmoji> {
    const targetUser = message.mentions.users.first() || message.author

    // Download their PFP
    const pfp = Buffer.from((await axios.get(targetUser.avatarURL({ format: 'png', size: 256 }), { responseType: 'arraybuffer' })).data, 'utf-8') // TODO: Allow gifs

    const image = await compress(pfp)

    message.util.send({ content: 'Uploading the following image as an emoji:', files: [new MessageAttachment(image)] })

    return message.guild.emojis.create(image, targetUser.username.replace(/[^a-zA-Z0-9]/gi, ''), { reason: `Requested by: ${message.author.tag}` })
      .catch((e) => {
        this.logger.error('PFP UPLOAD', e)
        return message.channel.send('Could not upload!')
      })
  }
}
