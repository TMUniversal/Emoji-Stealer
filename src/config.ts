/* eslint-disable no-unused-vars */
import { join, resolve } from 'path'
const file = require(join('..', 'data.json'))

interface IConfigFile {
    clientToken: string;
    webhook: IWebhook;
    botstatToken?: string;
    prefix: string;
    owners: string | string[];
}

interface IWebhook {
  id: string;
  secret: string;
}

const config: IConfigFile = { ...file }

export default config
