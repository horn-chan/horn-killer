import path from 'path'

import { createAudioPlayer, createAudioResource, getVoiceConnection } from '@discordjs/voice'
import { Message } from 'discord.js'
import { match } from 'ts-pattern'
import ytdl from 'ytdl-core'

import { youtubeSearch, getWatchUrl } from '../modules/google_api'
import { handleSummon } from './summon'
import { killMyself } from './utils/kill_myself'
import { store } from '../modules/store'

const getYoutubeStream = (url: string) => {
  return ytdl(url, { filter: 'audioonly' })
}

export const handlePlay = async (message: Message<boolean>, subTokens: string[]) => {
  const guild = message.guild
  if (!guild) {
    return
  }

  // 一度自信を切断し、再召喚する
  const didDisconnect = killMyself(guild)
  if (!didDisconnect) {
    handleSummon(message)
  }

  const player = createAudioPlayer()

  const input = await match(subTokens)
    .when((tokens) => tokens.length === 0, () => path.join(__dirname, '../default.mp3'))
    .when((tokens) => tokens.length === 1 && tokens[0].startsWith('http'), (tokens) => getYoutubeStream(tokens[0]))
    .when((tokens) => tokens.length > 0, async (tokens) => {
      const query = tokens.join(' ')
      const res = await youtubeSearch(query)
      if (!res) {
        return null
      }
      const url = getWatchUrl(res.videoId)
      getYoutubeStream(url)
    })
    .otherwise(() => null)

  if (!input) {
    return
  }

  const resource = createAudioResource(input, {
    inlineVolume: true
  })

  resource.volume?.setVolume(0.1)
  player.play(resource)

  if (message.guild === null) return
  const connection = getVoiceConnection(message.guild.id)
  connection?.subscribe(player)
  store.players.push(player)
  return player
}
