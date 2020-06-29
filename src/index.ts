import configFile from './config'
import BotClient from './client/BotClient'

const client = new BotClient({ token: configFile.clientToken, owners: configFile.owners })
client.start()
