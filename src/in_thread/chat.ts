import { Message } from 'discord.js'
import { MessageType } from 'discord-api-types/v10'
import { createCompletion } from '../modules/open_ai'

// スレッド上の返信の対応
export const handleThreadChat = async (message: Message<boolean>) => {
  const thread = message.channel
  if (thread.isThread()) {
    thread.sendTyping()

    // スレッドをたどってチャット履歴を作成
    const threadMessages = await thread.messages.fetch()
    const [lastMessage, ...messages] = threadMessages.filter((msg) => msg.type === MessageType.Default).values()
    const starterMsg = await thread.fetchStarterMessage()
    if (!starterMsg) return
    const [command, ...firstSubTokens] = starterMsg.content.split(' ')

    const model = command.includes('chat4') ? 'gpt-4' : 'gpt-3.5-turbo'
    const firstPrompt = firstSubTokens.join(' ')
    const lastPrompt = lastMessage.content ?? ''
    const msgs = [
      {
        role: 'user' as const,
        content: firstPrompt
      },
      ...messages.map((msg) => {
        return {
          role: msg.author.id === message.client?.user?.id ? 'assistant' : 'user' as 'assistant' | 'user',
          content: msg.content.replace(/<@.+>/g, '').trim()
        }
      })
    ]

    const completion = createCompletion(lastPrompt, {
      messages: msgs,
      model
    })

    await Promise.race([thread.sendTyping(), completion])

    const response = await completion
    thread.send(response?.content ?? 'ごめんね。なにか問題が起きたみたい！')
  }
}
