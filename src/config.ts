/* eslint-disable no-unused-vars */
import { join } from 'path'
import { Snowflake } from 'discord.js'
const file = require(join('..', 'data.json'))

interface IConfigFile {
    clientToken: string;
    webhook: IWebhook;
    botstatToken?: string;
    prefix: string;
    owners: Snowflake | Array<Snowflake>;
}

interface IWebhook {
  id: Snowflake;
  secret: string;
}

const config: IConfigFile = { ...file }

export default config
