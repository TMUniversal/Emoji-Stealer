import { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } from 'discord-akairo'
import { User, Message, ActivityType, ActivityOptions, Presence } from 'discord.js'
import WeebWrapper from '@tmuniversal/weeb-wrapper'
import * as path from 'path'
import axios, { AxiosInstance } from 'axios'
import { WebhookLogger } from '../structures/WebhookLogger'
import configFile from '../config'
import appRootPath from 'app-root-path'
import CustomEventEmitter from '../structures/CustomEventEmitter'

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    inhibitorHandler: InhibitorHandler;
    config: BotOptions;
    logger: WebhookLogger;
    wrapper?: WeebWrapper;
    botstat?: WeebWrapper['statistics'];
    customEmitter: CustomEventEmitter;

    start(): Promise<BotClient>;
    changeStatus(): Promise<Presence>;
    updateBotStats(guilds: number, channels: number, users: number): Promise<void>;
  }
}

interface BotOptions {
  token?: string;
  owners?: string | string[];
}

export default class BotClient extends AkairoClient {
  public config: BotOptions;
  public wrapper?: WeebWrapper;
  public botstat?: WeebWrapper['statistics'];
  public logger: WebhookLogger;
  public eventEmitter: CustomEventEmitter;

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: path.join(__dirname, '..', 'events')
  })

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: path.join(__dirname, '..', 'inhibitors')
  })

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: path.join(__dirname, '..', 'commands'),
    prefix: configFile.prefix,
    allowMention: false,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 6e3,
    argumentDefaults: {
      prompt: {
        modifyStart: (_: Message, str: string): string => `${str}\n\nType \`cancel\` to cancel this command...`,
        modifyRetry: (_: Message, str: string): string => `${str}\n\nType \`cancel\` to cancel this command...`,
        timeout: 'You have kept me waiting too long.',
        ended: 'Exceeded maximum amount of attempts, cancelling....',
        retries: 3,
        time: 3e4
      },
      otherwise: ''
    },
    ignoreCooldown: configFile.owners,
    ignorePermissions: configFile.owners
  })

  public constructor (config: BotOptions) {
    super({
      ownerID: config.owners
    })

    this.config = config
    this.logger = WebhookLogger.instance
    this.eventEmitter = CustomEventEmitter.instance

    if (configFile.weebToken && configFile.weebToken?.length !== 0) {
      this.wrapper = new WeebWrapper(configFile.weebToken, 'https://api.tmuniversal.eu')
      this.botstat = this.wrapper.statistics
    } else {
      this.wrapper = this.botstat = null
    }
  }

  private async _init (): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process
    })

    this.inhibitorHandler.loadAll()
    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
  }

  public async start (): Promise<BotClient> {
    // eslint-disable-next-line no-console
    console.log('Starting the bot...')
    await this._init()
    await this.login(this.config.token)

    this.eventEmitter.on('updateStats', (client: BotClient) => {
      client.updateBotStats(client.guilds.cache.size, client.channels.cache.size, client.users.cache.size)
    })
    this.eventEmitter.on('logCommand', (command: string) => {
      return this.logCommandToApi(command)
    })
    this.eventEmitter.on('changeStatus', () => {
      return this.changeStatus()
    })

    // Set a startup notice. This will be overridden upon ready.
    this.user.setActivity({ name: 'Starting up...', type: 'PLAYING' })

    // Automate status changes and upload stat uploads.
    this.setInterval(() => this.eventEmitter.emit('changeStatus'), 120000) // every two minutes
    this.setInterval(() => this.eventEmitter.emit('updateStats', this), 10 * 60 * 1000) // every ten minutes

    // Regex to match the root path of the project. Escapes path separators on windows and linux
    const pathRegex = new RegExp(appRootPath.toString().replace(/\\/gmi, '\\\\').replace(/\//gmi, '\\/'), 'gmi')

    // Error handling
    this.on('error', e => this.logger.error('CLIENT', e.message))
    this.on('warn', w => this.logger.warn('CLIENT', w))

    //  Process handling / do not crash on error
    process.once('SIGINT', () => {
      this.logger.warn('CLIENT', `[${this.user.username}] Received SIGINT => Quitting.`)
      this.destroy()
      process.exit(0)
    })
    process.on('uncaughtException', (err: Error) => {
      const errorMsg = (err ? err.stack || err : '').toString().replace(pathRegex, '.')
      this.logger.error('EXCEPTION', errorMsg)
    })
    process.on('unhandledRejection', (err: Error) => {
      const errorMsg = (err ? err.stack || err : '').toString().replace(pathRegex, '.')
      this.logger.error('REJECTION', 'Uncaught Promise error: \n' + errorMsg)
    })

    return this
  }

  // Function for (randomized) status changes
  public async changeStatus (options?: ActivityOptions) {
    const users = this.users.cache.size
    const channels = this.channels.cache.size
    const guilds = this.guilds.cache.size

    const statuses: Array<ActivityOptions> = [
      { type: 'PLAYING', name: `with ${users} users` },
      { type: 'LISTENING', name: `${users} users` },
      { type: 'WATCHING', name: `over ${users} users` },
      { type: 'PLAYING', name: `in ${guilds} servers` },
      { type: 'WATCHING', name: 'tmuniversal.eu' },
      { type: 'PLAYING', name: `${configFile.prefix}help for help` },
      { type: 'WATCHING', name: `${guilds} servers` }
    ]

    const chooseStatus = options || statuses[~~(Math.random() * statuses.length)]
    const details: ActivityOptions = { type: chooseStatus.type || 'PLAYING' as ActivityType }
    if (chooseStatus.url) details.url = chooseStatus.url
    return this.user.setActivity(chooseStatus.name, details)
  }

  // Upload user stats to api
  public async updateBotStats (guilds: number, channels: number, users: number) {
    if (!this.botstat) return Promise.resolve(this.logger.warn('API', 'Cannot upload bot stats: API is disabled'))
    return this.botstat.updateBot(this.user.id, guilds, channels, users)
      .then((r) => {
        // eslint-disable-next-line no-console
        return console.debug(`Uploaded user base stats to API: ${r.guilds} guilds, ${r.channels} channels, ${r.users} users.`)
      })
      .catch(err => this.logger.error('API', err))
  }

  // Upload command usage stats to api
  public async logCommandToApi (command: string) {
    if (!this.botstat) return Promise.resolve(this.logger.warn('API', 'Cannot upload command stats: API is disabled'))
    return this.botstat.increaseCommandUsage(this.user.id, command)
      .then((result) => {
        // eslint-disable-next-line no-console
        // return console.debug(`Command has been updated: ${result.command} was used ${result.uses} times.`)
      }).catch((err) => {
        return this.logger.error('API', err)
      })
  }
}
