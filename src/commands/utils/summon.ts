import { joinVoiceChannel } from '@discordjs/voice'
import { GuildMember } from 'discord.js'

// 呼び出しメンバーのいるボイスチャンネルに召喚
export const summon = (member: GuildMember) => {
  const voiceChannel = member?.voice.channel

  if (!voiceChannel) {
    return false
  }

  joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  })
  return true
}
