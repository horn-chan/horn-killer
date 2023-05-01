import { Message } from 'discord.js'

export const handleRoulette = (message: Message<boolean>, subTokens: string[]) => {
  if (subTokens.length === 0) {
    message.reply('何面のサイコロを振ればいいの？')
  }

  // 引数を10進数としてパース
  const n = parseInt(subTokens[0], 10)

  // 引数が数字でない場合
  if (Number.isNaN(n)) {
    message.reply('ちょっと何言ってるかわからない。。。')
    return
  }

  const dice = Math.floor(Math.random() * n) + 1
  message.reply(`ルーレット結果：${dice}`)
}
