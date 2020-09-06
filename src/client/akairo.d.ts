import { CommandHandler, ListenerHandler, InhibitorHandler } from 'discord-akairo'
import { Presence, Collection, Message, Snowflake } from 'discord.js'
import { WebhookLogger } from '../structures/WebhookLogger'
import CustomEventEmitter from '../structures/CustomEventEmitter'
import StatusUpdater from '@tmware/status-rotate'
import CounterManager from '../structures/CounterManager'
import DBL from 'dblapi.js'
import BotClient, { BotOptions } from './BotClient'
import WeebWrapper from '@tmuniversal/weeb-wrapper'

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler
    listenerHandler: ListenerHandler
    inhibitorHandler: InhibitorHandler
    config: BotOptions
    logger: WebhookLogger
    wrapper?: WeebWrapper
    dbl?: DBL
    statusUpdater: StatusUpdater
    customEmitter: CustomEventEmitter
    counter: CounterManager
    activeStealCommands: Collection<Snowflake, Message>

    start (): Promise<BotClient>
    changeStatus (): Promise<Presence>
    updateStats (): Promise<void>
    updateBotStats (guilds: number, channels: number, users: number): Promise<void>
    logCommandToApi (command: string): Promise<void>
    stop (): void
  }
}
