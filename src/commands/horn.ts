import { Message } from 'discord.js'
import { version } from '../modules/prefs'

export const handleHorn = (message: Message<boolean>, subTokens: string[]) => {
  if (subTokens[0] && subTokens[0] === 'now') { message.reply(new Date().toLocaleString()) }
  if (subTokens[0] && subTokens[0] === 'version') { message.reply(version || 'バージョンが未定義だってさ') }
}
