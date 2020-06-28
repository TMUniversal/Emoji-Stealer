/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
'use strict'

import { Client, Message, ActivityOptions, ActivityType } from 'discord.js'
import { WebhookLogger } from './structures/WebhookLogger'
import * as path from 'path'
import axios, { AxiosInstance } from 'axios'
import fs = require('fs')

// PREPARE
// ----------------------------------------------------------------------------

// Check folder existence
!fs.existsSync('./logs') && fs.mkdirSync('./logs')
!fs.existsSync('./src/commands/') && fs.mkdirSync('./src/commands/')

// DISCORD CLASS
// ----------------------------------------------------------------------------
export default class EmojiStealer {
  private client: Client
  private config: any
  logger: WebhookLogger
  botstat: AxiosInstance

  constructor () {
    this.client = new Client()
    this.config = require(path.resolve(__dirname, '..', 'data.json'))
    this.logger = WebhookLogger.instance
    this.botstat = axios.create({
      baseURL: 'https://tmuniversal-api.herokuapp.com/api/v1',
      timeout: 5000,
      headers: { Authorization: `Bearer ${this.config.botstatToken}` }
    })
  }

  public start (): void {
    this.logger.debug('Starting bot...')

    // => Bot is ready...
    this.client.on('ready', () => {
      this.logger.info('[Emoji Stealer] Connected.')
      this.logger.info(`Logged in as ${this.client.user.tag}`)

      const users = this.client.users.cache.size
      const channels = this.client.channels.cache.size
      const guilds = this.client.guilds.cache.size

      console.info(`Bot has started, with ${users} users, in ${channels} channels of ${guilds} guilds.`)

      const statuses: Array<ActivityOptions> = [
        { type: 'PLAYING', name: `with ${users} users` },
        { type: 'LISTENING', name: `${users} users` },
        { type: 'WATCHING', name: `over ${users} users` },
        { type: 'PLAYING', name: `in ${guilds} servers` },
        { type: 'WATCHING', name: 'tmuniversal.eu' },
        { type: 'PLAYING', name: `${this.config.prefix}help for help` },
        { type: 'WATCHING', name: `${guilds} servers` }
      ]

      const changeStatus = () => {
        const chooseStatus = statuses[~~(Math.random() * statuses.length)]
        const details: ActivityOptions = { type: chooseStatus.type || 'PLAYING' as ActivityType }
        if (chooseStatus.url) details.url = chooseStatus.url
        this.client.user.setActivity(chooseStatus.name, details)
      }

      this.client.setInterval(() => changeStatus(), 120000)
    })

    // => Message handler
    this.client.on('message', (message: Message) => {
      // => Prevent message from the bot
      if (!message.author.bot) {
        // => Test command
        if (message.content === this.config.prefix + 'ping') {
          message.reply('Pong !')
        }
      }
    })

    // => Bot error and warn handler
    this.client.on('error', e => this.logger.error(e.message))
    this.client.on('warn', w => this.logger.warn(w))

    // => Process handler
    process.once('SIGINT', () => {
      this.logger.info(`[${this.client.user.username}] Process exit.`)
      this.client.destroy()
    })
    process.on('exit', () => {
      this.logger.info(`[${this.client.user.username}] Process exit.`)
      this.client.destroy()
    })

    process.on('uncaughtException', (err: Error) => {
      const errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}/`, 'g'), './')
      this.logger.error(errorMsg)
    })
    process.on('unhandledRejection', (err: Error) => {
      this.logger.error('Uncaught Promise error: \n' + err.stack)
    })

    // => Login
    this.client.login(this.config.clientToken)
  }
}
