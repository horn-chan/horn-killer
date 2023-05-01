import { google } from 'googleapis'
import { youtubeApiKey } from './prefs'
google.options({
  http2: true
})
const apiKey = youtubeApiKey

export const getWatchUrl = (videoId: string) => {
  return `https://www.youtube.com/watch?v=${videoId}`
}

const youtube = google.youtube({ version: 'v3', auth: apiKey })

export const youtubeSearch = async (query: string) => {
  const listRes = await youtube.search.list({
    q: query,
    type: ['video'],
    part: ['id'],
    maxResults: 1
  })

  const { items } = listRes.data
  if (!items || items?.length === 0) {
    return null
  }

  const videoId = items[0].id?.videoId
  if (!videoId) {
    return null
  }

  const videoRes = await youtube.videos.list({
    part: ['snippet', 'contentDetails'],
    id: [videoId]
  })

  const videoItem = videoRes.data.items
  if (!videoItem || videoItem?.length === 0) {
    return null
  }

  const { snippet, contentDetails } = videoItem[0]
  if (!snippet || !contentDetails) {
    return null
  }
  const { title, description, channelTitle } = snippet
  const { duration } = contentDetails
  return {
    videoId,
    title,
    description,
    channelTitle,
    duration
  }
}
