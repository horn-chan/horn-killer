import path from 'path'

import { createAudioPlayer, createAudioResource, getVoiceConnection } from '@discordjs/voice'
import { Message } from 'discord.js'
import { match } from 'ts-pattern'
import ytdl from 'ytdl-core'

import { youtubeSearch, getWatchUrl } from '../modules/google_api'
import { handleSummon } from './summon'
import { store } from '../modules/store'

const getYoutubeStream = (url: string) => {
  return ytdl(url, { filter: 'audioonly' })
}

export const handlePlay = async (message: Message<boolean>, subTokens: string[]) => {
  const guild = message.guild
  if (!guild) {
    return
  }

  // ボイスチャンネルにいなければ召喚する
  const connection = getVoiceConnection(guild.id) ?? await handleSummon(message)

  // 再生済みであれば一度停止する
  const prevPlayer = store.players.get(guild.id)
  if (prevPlayer) {
    prevPlayer.stop()
  }

  // コマンド引数をもとに音源を選択する
  const input = await match(subTokens)
    .when((tokens) => tokens.length === 0, () => path.join(__dirname, '../../default.mp3'))
    .when((tokens) => tokens.length === 1 && tokens[0].startsWith('http'), (tokens) => getYoutubeStream(tokens[0]))
    .when((tokens) => tokens.length > 0, async (tokens) => {
      const query = tokens.join(' ')
      const res = await youtubeSearch(query)
      if (!res) {
        return null
      }
      const url = getWatchUrl(res.videoId)
      return getYoutubeStream(url)
    })
    .otherwise(() => null)

  // 該当する音源が存在しなければなにもしない
  if (!input) {
    return
  }

  // 音量調整可能な状態で、音源をもとにオーディオリソースを作成
  const resource = createAudioResource(input, {
    inlineVolume: true
  })

  // オーディオプレイヤーを作成
  // 停止用にオーディオプレイヤーはサーバーIDをキーに保存
  const player = createAudioPlayer()
  store.players.set(guild.id, player)

  // 音量を0.1に調整し、再生する
  resource.volume?.setVolume(0.1)
  player.play(resource)

  // ボイスチャンネルから購読する
  connection?.subscribe(player)

  return player
}
