import { Command } from 'discord-akairo'
import { Activity, Message } from 'discord.js'
import { MessageEmbed } from '../../structures/MessageEmbed'
import { WebhookLogger } from '../../structures/WebhookLogger'

export default class ShutdownCommand extends Command {
  logger: WebhookLogger = WebhookLogger.instance
  public constructor () {
    super('shutdown', {
      aliases: ['shutdown', 'stopbot'],
      category: 'owner',
      description: {
        content: 'Shut down the bot',
        usage: 'shutdown',
        examples: [
          'shutdown'
        ]
      },
      ratelimit: 3,
      args: [
        {
          id: 'confirmed',
          prompt: {
            start: 'Are you sure you want to shut the bot down? Type `yes` to confirm.',
            retries: 1
          },
          match: 'rest'
        }
      ],
      ownerOnly: true
    })
  }

  public async exec (message: Message, args: { confirmed: 'yes' | string }) {
    if (args.confirmed !== 'yes') return message.util.reply('Will not shut down.')
    this.logger.warn('CLIENT', `Shutdown command received! Exit initiated by ${message.author.tag}, will execute!`)
    await message.util.send('Alright. Shutting down in 3 seconds...')
    this.client.stop()
  }
}
