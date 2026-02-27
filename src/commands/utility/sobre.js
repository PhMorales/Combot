const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sobre")
        .setDescription("Explico um pouco sobre alguém")
        .addStringOption((option) => option.setName("escolha")
            .setDescription("Escolha qm será explicado pelo bot")
            .setChoices([{
                name: 'ComBot',
                value: 'bot'
            },
            {
                name: 'Combo',
                value: 'criador'
            }]).setRequired(true)),

    async execute(interaction, db, client) {
        const embed = new EmbedBuilder().setColor('Random')
        const select = interaction.options.getString("escolha", true)

        if (select === 'bot') {
            embed.setTitle('ComBot');
            embed.setDescription("Salve, sou o ComBot, um bot feito pelo Combo pra fazer... n sei exatamente, mas tamo ai e é isso");
            interaction.reply({ embeds: [embed] })

        }
        if (select === 'criador') {
            embed.setTitle('Combo');
            embed.setDescription("Olá, sou o Combo, eu sou uma pessoa q existe nesse mundão de meu deus e eu fiz esse bot pra... verificar memes? acho q isso é oq mais responde");

            interaction.reply({ embeds: [embed] })


        }
    }
}