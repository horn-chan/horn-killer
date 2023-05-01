import { Message } from 'discord.js'

export type Command = {
    command: string;
    description: string;
    syntax: string;
    handler: (message: Message, subTokens: string[], state: any) => any;
}
