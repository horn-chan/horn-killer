import { Client, Message } from 'discord.js'
import { match } from 'ts-pattern'

import { commands, handleOtherwise } from './command'
import { prefix, token } from './modules/prefs'
import { handleThreadChat } from './in_thread/chat'

const state: Record<string, any> = {}

// クライアントのインスタンス作成
// サーバーと、メンバー、メッセージに関して反応する
const client = new Client({
  intents: [
    'Guilds',
    'GuildMembers',
    'GuildMessages',
    'GuildVoiceStates',
    'MessageContent'
  ]
})

// 接続したら
client.once('ready', async (client) => {
  console.log('Ready!')
  client.user.setPresence({
    activities: [{ name: '寝不足なんて許さないんだから！' }],
    status: 'online'
  })
})

const validator = (prefix: string, message: Message): boolean => {
  // BOTのメッセージは無視
  if (message.author.bot) return false

  // 自分が作成したスレッドのメッセージは有効
  if (message.channel.isThread() && message.channel.ownerId === client?.user?.id) {
    return true
  }

  // それ以外であればプレフィックスで判断
  return message.content.startsWith(prefix)
}

client.on('messageCreate', (message) => {
  // 有効性の検証
  if (!validator(prefix, message)) {
    return
  }

  // ここに到達するものはプレフィックス付きか、ボットが作成したスレッドへのメッセージ
  // 先にスレッドだった場合の処理を行う
  // 現時点ではチャットのみが対応なので雑に実装
  const text = message.content
  if (!text.startsWith(prefix)) {
    handleThreadChat(message)
    return
  }

  // プレフィックス付きメッセージ
  // 構文解析
  const tokens = text.replace(prefix, '').split(' ')
  if (tokens.length === 0) return
  const [command, ...subTokens] = tokens

  // コマンド実行
  const res = match(command)
    .when(
      (c) => commands.find((v) => c === v.command),
      (c) => commands.find((v) => c === v.command)?.handler(message, subTokens, state[command])
    )
    .otherwise(() => handleOtherwise(message))
  if (res) {
    state[command] = res
  }
})

// Discordにログイン
client.login(token)
