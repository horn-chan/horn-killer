import { Message } from 'discord.js'
import { createCompletion } from '../modules/open_ai'

export const handleChat = (model: string) => async (message: Message<boolean>, subTokens: string[]) => {
  // APIに問い合わせ
  const prompt = subTokens.join(' ')
  const option = {
    model
  }
  const completion = createCompletion(prompt, option)

  // hornchan絵文字があればそれを、なければeyesの絵文字で元メッセージにリアクション
  const hornchan = message.guild?.emojis.cache.find(emoji => emoji.name === 'hornchan')
  message.react(hornchan ?? '👀')

  // messageからスレッドを開始する
  const thread = await message.startThread({
    name: `${prompt.substring(0, 15)}${prompt.length > 15 ? '...' : ''}`,
    autoArchiveDuration: 60
  })

  await Promise.race([thread.sendTyping(), completion])

  // スレッドに投稿
  const response = await completion
  thread.send(response?.content ?? 'ごめんね。なにかエラーが起きたっぽい！')

  // 元メッセージにつけた自身のリアクションをすべて消去
  const userId = message.client.user?.id
  if (userId) {
    message.reactions.cache.filter(reaction => reaction.users.cache.has(userId)).forEach(reaction => {
      reaction.users.remove(userId)
    })
  }
}
