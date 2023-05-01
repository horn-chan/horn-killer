import {
  Message
} from 'discord.js'
import {
  handlePing,
  handleKill,
  handleKillYou,
  handleRoulette,
  handleSummon,
  handlePlay,
  handleChat,
  handleStop,
  handleHorn
} from './commands'
import { Command } from './types'
import { prefix } from './modules/prefs'

const getHelpStr = (command: Command) => `\`${prefix}${command.command} ${command.syntax}\` - ${command.description}`
const handleHelp = (message: Message<boolean>) => {
  message.reply(`わたしになにをしてほしいのかな…？\n${commands.map(getHelpStr).join('\n\n')}`)
}

export const handleOtherwise = (message: Message<boolean>) => {
  message.reply(`私がわかる言葉は次のものだけだよ？\n${commands.map((command) => command.command).join(', ')}`)
}

export const commands: Command[] = [
  {
    command: 'help',
    description: 'ヘルプを表示する。',
    syntax: '',
    handler: handleHelp
  },
  {
    command: 'ping',
    description: '接続確認。正常だとpongを返す。',
    syntax: '',
    handler: handlePing
  },
  {
    command: 'killme',
    description: 'コマンドの実行者をボイスチャンネルから切断する。`at`または`after`を用いて時間指定の予約を行うことができる。',
    syntax: '[at | after] [noon | midnight | (hour):(minute)]',
    handler: handleKill
  },
  {
    command: 'killall',
    description: 'コマンド実行者のいるボイスチャンネルにいる全員をボイスチャンネルから切断する。killmeと構文は同じ',
    syntax: '[at | after] [noon | midnight | (hour):(minute)]',
    handler: (message: Message<boolean>, subTokens: string[]) => {
      handleKill(message, subTokens, true)
    }
  },
  {
    command: 'killyou',
    description: 'ボイスチャンネルから切断する。',
    syntax: '',
    handler: handleKillYou
  },
  {
    command: 'roulette',
    description: 'n面サイコロを振って数値を返す（例：3を与えたとき、1, 2, 3のいずれかを返す）',
    syntax: '(n)',
    handler: handleRoulette
  },
  {
    command: 'summon',
    description: 'コマンド実行者のいるボイスチャンネルに召喚する。',
    syntax: '',
    handler: handleSummon
  },
  {
    command: 'play',
    description: '引数に与えたURLまたは検索文字列から、YouTubeの再生を行う。ボイスチャンネルにいない場合はコマンド実行者のいるボイスチャンネルに召喚される。',
    syntax: '[URL | search word]',
    handler: handlePlay
  },
  {
    command: 'chat',
    description: 'ChatGPT APIを使用して会話を行う。GPT-3.5を使用する。スレッドが作成され、その中での会話は記憶する。',
    syntax: 'prompt',
    handler: handleChat('gpt-3.5-turbo')
  },
  {
    command: 'chat4',
    description: 'ChatGPT APIを使用して会話を行う。GPT-4を使用する。スレッドが作成され、その中での会話は記憶する。',
    syntax: 'prompt',
    handler: handleChat('gpt-4')
  },
  {
    command: 'stop',
    description: '再生中の音声を停止する。',
    syntax: '',
    handler: handleStop
  },
  {
    command: 'horn',
    description: 'なんらかの実験的機能を追加することがある。',
    syntax: '(subcommand)',
    handler: handleHorn
  }
]
