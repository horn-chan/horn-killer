import { Message } from 'discord.js'

export const handlePing = (message: Message<boolean>) => {
  message.reply({
    content: 'pong!'
  })
}
