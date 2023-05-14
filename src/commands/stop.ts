import { Message } from 'discord.js'
import { store } from '../modules/store'

export const handleStop = (message: Message) => {
  const guild = message.guild
  if (!guild) {
    return false
  }

  const player = store.players.get(guild.id)
  if (!player) {
    return false
  }

  player.stop()
  store.players.delete(guild.id)
}
