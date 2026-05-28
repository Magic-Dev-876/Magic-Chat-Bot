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
            const commandFiles = interaction.client.commands.map(command => command.filePath);

            commandFiles.forEach(filePath => {
                delete require.cache[require.resolve(filePath)];
            });
        } else {
            delete require.cache[require.resolve(command.filePath)];
        }

        if (commandName === 'all') {
            const commands = Array.from(interaction.client.commands);

            commands.forEach(commands => {
                console.log(commands);
                
                delete require.cache[
                    require.resolve(commands[1].filePath)
                    ];
                });
            
            const newCommands = [];
        
            commands.forEach(command => {
                const newCommand = require(command[1].filePath);
                newCommand.filePath = command[1].filePath;
                interaction.client.commands.set(
                    newCommand.data.name,
                    newCommand,
                    newCommand.filePath
                );
                newCommands.push(newCommand.data.name);
            });
        
            await interaction.reply(
                `Commands \`${newCommands.join(', ')}\` were reloaded!`
            );
        
            return;
        
        
        } else {
            try {
                const newCommand = require(command.filePath);
                newCommand.filePath = command.filePath;
                interaction.client.commands.set(newCommand.data.name, newCommand, newCommand.filePath);
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