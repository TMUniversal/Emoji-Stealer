/* eslint-disable no-unused-vars */
import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import { User, Message, ActivityType, ActivityOptions } from 'discord.js'
import * as path from 'path'
import axios, { AxiosInstance } from 'axios'
import { WebhookLogger } from '../structures/WebhookLogger'
import configFile from '../config'

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
  }
}

interface BotOptions {
  token?: string;
  owners?: string | string[];
}

export default class BotClient extends AkairoClient {
  public config: BotOptions;
  public botstat?: AxiosInstance;
  public logger: WebhookLogger;

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: path.join(__dirname, '..', 'events')
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

    if (configFile.botstatToken && configFile.botstatToken?.length !== 0) {
      this.botstat = axios.create({
        baseURL: 'https://tmuniversal-api.herokuapp.com/api/v1',
        timeout: 5000,
        headers: { Authorization: `Bearer ${configFile.botstatToken}` }
      })
    } else this.botstat = undefined
  }

  private async _init (): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process
    })

    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
  }

  public async start (): Promise<BotClient> {
    // eslint-disable-next-line no-console
    console.log('Starting the bot...')
    await this._init()
    await this.login(this.config.token)

    const users = this.users.cache.size
    const channels = this.channels.cache.size
    const guilds = this.guilds.cache.size

    await this.updateBotStats(guilds, channels, users)

    this.setInterval(() => this.changeStatus(), 120000)

    // Error handling
    this.on('error', e => this.logger.error(e.message))
    this.on('warn', w => this.logger.warn(w))

    //  Process handling
    process.once('SIGINT', () => {
      this.logger.info(`[${this.user.username}] Process exit.`)
      this.destroy()
    })
    process.on('exit', () => {
      this.logger.info(`[${this.user.username}] Process exit.`)
      this.destroy()
      process.exit(0)
    })
    process.on('uncaughtException', (err: Error) => {
      const errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}/`, 'g'), './')
      this.logger.error(errorMsg)
    })
    process.on('unhandledRejection', (err: Error) => {
      this.logger.error('Uncaught Promise error: \n' + err.stack)
    })

    return this
  }

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
    this.user.setActivity(chooseStatus.name, details)
  }

  public async updateBotStats (guilds: number, channels: number, users: number) {
    if (!this.botstat) return Promise.resolve(this.logger.warn('Botstat API is disabled'))
    return this.botstat.patch('/botstat/' + this.user.id, {
      guilds: guilds,
      channels: channels,
      users: users
    })
      // eslint-disable-next-line no-console
      .then(() => console.info('Uploaded user base stats to API.'))
      .catch(e => this.logger.error(e))
  }
}
