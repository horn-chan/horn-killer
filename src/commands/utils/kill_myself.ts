import { Guild } from 'discord.js'

// 自身をボイスチャンネルから切断
export const killMyself = async (guild: Guild) => {
  const me = guild.members.me
  const voiceChannel = me?.voice.channel

  // ボイスチャンネルにいなければfalseを返して終了
  if (!voiceChannel) {
    return false
  }

  // ボイスチャンネルがあれば切断
  me.voice.disconnect()
  return true
}
