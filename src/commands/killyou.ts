import { Message } from 'discord.js'
import { killMyself } from './utils/kill_myself'

export const handleKillYou = async (message: Message<boolean>) => {
  const guild = await message.guild?.fetch()
  if (!guild) {
    return
  }

  // 切断実行
  const didDisconnect = killMyself(guild)

  // 実行結果がfalseならもとからボイスチャンネルにいない
  if (!didDisconnect) {
    message.reply({
      content: 'ボイスチャンネルに入ってないよ？'
    })
  }
}
