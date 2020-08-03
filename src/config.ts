import { join } from 'path'
import { Snowflake } from 'discord.js'
const file = require(join('..', 'data.json'))

interface IConfigFile {
    clientToken: string;
    webhook: IWebhook;
    weebToken?: string;
    dblToken?: string;
    prefix: string;
    owners: Snowflake | Array<Snowflake>;
    userBlacklist: Array<Snowflake>;
}

interface IWebhook {
  id: Snowflake;
  secret: string;
}

const config: IConfigFile = { ...file }

export default config
