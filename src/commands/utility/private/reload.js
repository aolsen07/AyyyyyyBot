const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload a command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true);
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`There is no command with the name \`${commandName}\`!`);
        }

        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
            const newCmd = require(`./${command.data.name}.js`);
            interaction.client.commands.set(newCmd.data.name, newCmd);
            await interaction.reply(`Command \`${newCmd.data.name}\` was reloaded.`);
        }
        catch (error) {
            console.error(error);
            await interaction.reply(`Error while reloading command \`${command.data.name}\`.\n\`${error.message}\``);
        }
    },
};