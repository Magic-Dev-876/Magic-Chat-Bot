const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('love')
        .setDescription('Evaluates the love percentage between two people')
        .addUserOption(option => option.setName('user').setDescription('The user to evaluate love with').setRequired(true)),
    async execute(interaction) {
        const lovePercentage = Math.floor(Math.random() * 101);
        const user = interaction.options.getUser('user');
        await interaction.reply(`The love percentage between ${interaction.user.mention()} and ${user.mention()} is ${lovePercentage}%!`);
    },
};
