import { Message } from 'discord.js'
import { summon } from './utils/summon'

export const handleSummon = async (message: Message<boolean>) => {
  const member = await message.member?.fetch(true)
  const voiceChannel = member?.voice.channel
  if (!voiceChannel) {
    message.reply({
      content: 'あなたがボイスチャンネルにいないから、どこにはいればいいかわかんないよぉ'
    })
    return
  }
  summon(member)
}
