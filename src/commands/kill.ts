import { GuildMember, Message } from 'discord.js'
import { getNextSuggestedTime, getPassedTime, parseTimeStr } from '../modules/time'
import { match } from 'ts-pattern'
import { summon } from './utils/summon'

// 殺害予告の通知が何ミリ秒前か
const notificationTimeBeforeKill = 5 * 60 * 1000

// 実際に殺すときの通知が何ミリ秒前か
const notificationTimeKill = 30 * 1000

// 殺害実行用
const kill = (isAll: boolean) => (member: GuildMember) => {
  const voiceChannel = member.voice.channel

  // ターゲットがボイスチャンネルにいないときはなにもしない
  if (!voiceChannel) {
    return
  }

  // killallのとき
  if (isAll) {
    voiceChannel.members.forEach((guildMember) => guildMember.voice.disconnect())
    return
  }

  // 単発のとき
  member?.voice.disconnect()
}

export const handleKill = async (message: Message<boolean>, subTokens: string[], isAll = false) => {
  // ターゲットを取得
  const member = await message.member?.fetch(true)

  // ターゲットがいなければなにもしない
  if (!member) {
    return
  }

  // 殺害実行用
  const killTarget = kill(isAll)

  const voiceChannel = member.voice.channel
  if (!voiceChannel) {
    message.reply('ボイスチャンネルにいないから殺せないです')
    return
  }

  // サブコマンドがないとき
  // nowコマンドのショートハンド
  if (subTokens.length === 0) {
    subTokens.push('now')
  }

  // 実行
  if (subTokens[0] === 'now') {
    message.reply('わかった…殺すね？')
    killTarget(member)
    return
  }

  const at = subTokens[1]
  // 構文エラー
  if (!at) {
    message.reply('ちゃんと構文を守って…？')
    return
  }

  // 時間解析
  const killTime = parseTimeStr(at)
  if (killTime === null) {
    message.reply('うーん、、、それは何時のことを言ってるのかな…？')
    return
  }
  const [hour, minute] = killTime
  const now = new Date()
  const killAt = match(subTokens[0])
    .with('at', () => {
      return getNextSuggestedTime(hour, minute, now)
    })
    .with('after', () => {
      return getPassedTime(hour, minute, now)
    })
    .otherwise(() => null)
  if (killAt === null) {
    message.reply('nowかatかafterだけわかるよ！　ほかの言葉はまだむずかしいの。。。')
    return
  }

  const timeDifference = killAt.getTime() - now.getTime()
  message.reply(
      `わかった。${killAt.getHours()}時${killAt.getMinutes()}分に殺すね。`
  )

  // 通知時間が過ぎてなければ通知予約
  if (timeDifference > notificationTimeBeforeKill) {
    const channel = member.voice.channel
    if (!channel) return

    // 殺害予告通知
    setTimeout(async () => {
      // 再取得
      const _member = await member.fetch(true)
      if (!_member) {
        return
      }
      summon(_member)
    }, timeDifference - notificationTimeBeforeKill)

    // 殺害通知
    setTimeout(() => {
      channel.guild.members.me?.voice.disconnect()
    }, timeDifference - notificationTimeKill)
  }

  // 殺害実行
  setTimeout(() => {
    message.reply('時間になったから殺すね')
    killTarget(member)
  }, timeDifference)
}

export const handleKillAll = async (message: Message<boolean>, subTokens: string[]) => {
  handleKill(message, subTokens, true)
}
