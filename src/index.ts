import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js';
import dotenv from 'dotenv'
import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import path from 'path';

dotenv.config()

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '9' }).setToken(String(process.env.TOKEN));

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands[0].name} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(String(process.env.CLIENT_ID), String(process.env.GUILD_ID)),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;

    if (command === 'koukan') {
        try {
            const koukanCommand = require('./commands/koukan/koukan');
            await koukanCommand.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply('コマンドの実行中にエラーが発生しました。');
        }
    }
});
client.login(process.env.TOKEN);
