import dotenv from "dotenv";
import { SlashCommandBuilder, REST, Routes } from "discord.js";
dotenv.config();

const ping = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pong!")
const hello = new SlashCommandBuilder()
    .setName("Hello")
    .setDescription("挨拶をします")
    .addStringOption((option) =>
        option
            .setName("language")
            .setDescription("言語を指定します")
            .setRequired(true)
            .addChoices(
            { name: "Japanese", value: "ja"},
            { name: "english", value: "en"}
            )
    )
const help = new SlashCommandBuilder()
    .setName("help")
    .setDescription("コマンド一覧を表示します")

const commands = [ping, hello, help]

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!)
    async function main(){
        await rest.put(
            Routes.applicationCommands(""),
            {body: commands}
        )
    }
main().catch((err) => console.log(err))

