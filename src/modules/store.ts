import { AudioPlayer } from '@discordjs/voice'

type guildId = string;

export const store = {
  players: new Map() as Map<guildId, AudioPlayer>
}
