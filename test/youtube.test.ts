import { getWatchUrl, youtubeSearch } from '../src/modules/google_api'

// YouTube検索テスト
const youtubeSearchTest = async (token: string) => {
    const res = await youtubeSearch(token)
    if (!res) {
        return null
    }
    const url = getWatchUrl(res.videoId)
    console.log(url, res)
    return url
}

test('search', async () => {
    const result = await youtubeSearchTest('Dmitri Shostakovich: Waltz No. 2 - Carion Wind Quintet')
    expect(result).toBe('https://www.youtube.com/watch?v=_2Y1hCgDvNE')
})