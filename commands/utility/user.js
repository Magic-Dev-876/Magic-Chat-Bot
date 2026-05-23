const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with information about the user.'),
    async execute(interaction) {
        await interaction.reply(
            `Your tag: ${interaction.user.username}\nJoined at: ${interaction.member.joinedAt}`
        );
    },
};
