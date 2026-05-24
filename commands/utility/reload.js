const { SlashCommandBuilder } = require('discord.js');

const authorizedIDs = [process.env.OWNER_ID];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads commands')
        .addStringOption(option => option.setName('command').setDescription('The command to reload').setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command').toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!authorizedIDs.includes(interaction.user.id)) {
            return interaction.reply('You do not have permission to use this command!');
        }

        if (!command && commandName !== 'all') {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        } else if (commandName === 'all') {
            const commandFiles = interaction.client.commands.map(cmd => cmd.data.name);

            commandFiles.forEach(file => {
                delete require.cache[require.resolve(`./${file}.js`)];
            });
        } else {
            delete require.cache[require.resolve(`./${command.data.name}.js`)];
        }

        if (commandName === 'all') {
            const newCommands = interaction.client.commands.map(command => {
                const newCommand = require(`./${command.data.name}.js`);
                interaction.client.commands.set(newCommand.data.name, newCommand);
                return newCommand.data.name;
            });

            await interaction.reply(`Commands \`${newCommands.join(', ')}\` were reloaded!`);
            return;
        } else {
            try {
                const newCommand = require(`./${command.data.name}.js`);
                interaction.client.commands.set(newCommand.data.name, newCommand);
                await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
            } catch (error) {
                console.error(error);
                await interaction.reply(
                    `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``
                );
            }
        }
    },
};