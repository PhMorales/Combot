const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const YAML = require("js-yaml")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jogar-junto")
        .setDescription("Equivalente ao resgate da twitch")
        .addStringOption((option) => option.setName("nick")
            .setDescription('Insira o seu nick')
            .setRequired(true)),

    async execute(interaction, db, client) {
        if (db.EspacosFila <= 0) {
            interaction.reply({ content: "A fila está fechada no momento. Espere até ela reabrir para resgatar", ephemeral: true })
            return;
        }
        if (db.JogadoresFila.some(find => find.nick === interaction.member.user.username && find.modo === db.Modo)) {
            interaction.reply({ content: "Você já está na fila. Espere ela reiniciar antes de resgatar novamente", ephemeral: true })
            return;
        }


        const embed = new EmbedBuilder().setColor('#575cff')

        const usuario_nick = interaction.options.getString('nick')

        embed.setAuthor({
            'name': `${interaction.member.user.displayName}`
            , iconURL: `${interaction.member.user.displayAvatarURL()}`
        });

        embed.setTitle("Resgatou Jogar Junto")
        embed.setDescription(`- Nick: **${usuario_nick}** \n - Modo: **${db.Modo == 'br' ? 'Battle Royale/OG' : 'Ballistic/Outros'}**`);

        fila = client.channels.cache.find(channel => channel.name === "🛒・fila-de-resgates").id

        try {


            db.JogadoresFila.push({ 'nick': interaction.member.user.username, 'modo': db.Modo })
            db.EspacosFila -= 1


            const save = YAML.dump(db)
            fs.writeFileSync("./src/db/db.yaml", save, function (err, file) {
                if (err) throw err;
                console.log(err)
            })


            client.channels.cache.get(`${fila}`).send({ embeds: [embed] }).then(function (message) {
                message.react("✅")
            })

            interaction.reply({ content: "Tá na fila maninho!", ephemeral: true })


        } catch (e) {
            interaction.reply({ content: "Rolou um erro, fala pro combo aí q alguma hora ele resolve", ephemeral: true })
        }

    }
}