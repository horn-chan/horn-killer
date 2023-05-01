import { AudioPlayer } from '@discordjs/voice'
import { Message } from 'discord.js'
import { store } from '../modules/store'

export const handleStop = (message: Message) => {
  const players = store.players
  players.forEach((player: AudioPlayer) => {
    player.stop()
  })
}
