import { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, Guild } from "discord.js";
import * as deepl from "deepl-node";
import dotenv from "dotenv";

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

const authKey = process.env.DEEPL_API_KEY!
const translator = new deepl.Translator(authKey);
const prefix = "!";
let CHID: string|null = null;

function targetLanguage(msg: string): "ja" | "en-US" {
    const isJapanese = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(msg);
    const isEnglish = /^[A-Za-z0-9\s.,?!-]*$/.test(msg);
    if (isJapanese) {
        return "en-US";
    } else if(isEnglish){
        return "ja";
    } else {
        return "ja";
    }
}

/*
async function getAPIUsage(){
        const response = await fetch(" https://api-free.deepl.com/usage",{
            method: "GET",
            headers: new Headers({"Authorization": `DeepL-Auth-Key ${authKey}`})
        })
        return response.text()

}
*/

client.on("ready",(message) => {
    console.log("discord bot is ready!");
    setInterval(() => {
        client.user?.setActivity({
            name: `ping: ${client.ws.ping}ms`,
        });
    }, 1000);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id == CHID && message.content.length >= 1 && !message.content.startsWith(prefix) && !URL.canParse(message.content) ){
        const result = await translator.translateText(message.content, null, targetLanguage(message.content));
        console.log (targetLanguage(message.content))
        message.channel.send(result.text);
        console.log(result.text)
    }
    if (!message.content.startsWith(prefix)) return;
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+g/);
    try {
    if (command === "start") {
        CHID = message.channel.id
        message.channel.send("翻訳を開始します\nstart translation.");
    }else if (command === "end") {
        CHID = null
        message.channel.send("翻訳を終了しました\nfinidh translation.");
    /*
    }else if (command === "usage"){
        const usage = await getAPIUsage()
        message.channel.send(usage)
    */
    }else if (command === "shutdown"){
        if(message.author.id != "1088244307028361317"){
            message.channel.send("permission denied");
            return
        }
        await client.destroy()
        
    }else if (command === "help"){
        console.log("- !start: 翻訳を開始します\n- !end: 翻訳を終了します\n- !shutdown: (BOT管理者のみ)BOTをシャットダウンします")
    }
}catch(e: unknown){
    if (e instanceof Error){
        console.log(e.message)       
    }}
})
client.login(process.env.DISCORD_BOT_TOKEN);
