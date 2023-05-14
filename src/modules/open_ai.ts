import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
import { chatGPTSystemRole, openAiApiKey } from './prefs'

const configuration = new Configuration({
  apiKey: openAiApiKey
})
const openai = new OpenAIApi(configuration)

type ChatOption = {
  model: string;
  messages?: ChatCompletionRequestMessage[];
}

export const createCompletion = async (prompt: string, option: ChatOption) => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: chatGPTSystemRole || 'あなたはDiscord BOTです。'
      },
      ...(option.messages || []),
      {
        role: 'user',
        content: prompt
      }
    ]
  })
    .then((completion) => completion.data.choices[0].message)
    .catch((e) => (console.log({
      content: null,
      status: e.response.status,
      statusText: e.response.statusText,
      message: e.response.data.error.message
    })))
  return completion
}
