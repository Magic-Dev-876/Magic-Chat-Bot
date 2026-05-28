const { SlashCommandBuilder, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const authorizedIDs = [process.env.OWNER_ID];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('globaldeploy')
        .setDescription('Deploys commands globally'),
    async execute(interaction) {
        if (!authorizedIDs.includes(interaction.user.id)) {
            return interaction.reply('You do not have permission to use this command!');
        }

        await interaction.reply('Starting global deployment of commands...');

        const commands = []
        const foldersPath = path.join(__dirname, '..');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                    await interaction.editReply(`There was an error while loading command \`${file}\`! Check the console for details.`);
                }
            }
            const rest = new REST().setToken(process.env.DISCORD_TOKEN);

            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
                await interaction.editReply(`Started refreshing ${commands.length} application (/) commands globally!`);

                const data = await rest.put(
                    Routes.applicationCommands(interaction.client.application.id),
                    { body: commands },
                );
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
                await interaction.editReply(`Successfully deployed ${data.length} application (/) commands globally!`);
            } catch (error) {
                console.error(error);
                await interaction.editReply('There was an error while deploying commands globally!');
            }
        }
    },
};
