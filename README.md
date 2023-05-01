# horn-killer

Discord BOT『horn-killer』開発用リポジトリ

## Get started

1. clone

   ```bash
   git clone https://github.com/horn-chan/horn-killer
   ```
2. 依存関係をインストール

   ```bash
   cd horn-killer

   npm install
   # or
   npm i
   ```
3. `.env`ファイルを作成

   ```bash
   vi .env
   ```

   ```
   VERSION='1.0.0'

   BOT_PREFIX='ib.'
   BOT_TOKEN='xxxxxxxxxx'

   YOUTUBE_API_KEY='xxxxxxxxxx'

   OPENAI_API_KEY='sk-xxxxxxxxxx'
   CHATGPT_SYSTEM_ROLE = 'あなたはDiscordのBOTです。あなたのBOTとしての名前は「horn-killer」といいます。'
   ```
4. 実行

   ```bash
   npm start
   ```
