import dotenv from 'dotenv'
dotenv.config()

export const prefix = process.env.BOT_PREFIX || '/'
export const token = process.env.BOT_TOKEN
export const version = process.env.VERSION

export const youtubeApiKey = process.env.YOUTUBE_API_KEY

export const openAiApiKey = process.env.OPENAI_API_KEY
export const chatGPTSystemRole = process.env.CHATGPT_SYSTEM_ROLE
