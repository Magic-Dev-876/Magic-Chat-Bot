const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Says exactly what you put in!')
    .addStringOption(option => option.setName('input').setDescription('The input to echo back').setRequired(true));

module.exports = {
    data,
    async execute(interaction) {
        const input = interaction.options.getString('input');
        await interaction.reply(input);
    },
};
