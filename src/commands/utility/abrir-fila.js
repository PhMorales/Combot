const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const YAML = require("js-yaml")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("abrir-fila")
        .setDescription("Abre ou configura espaços na fila de resgates")
        .addStringOption((option) => option.setName("tamanho-fila")
            .setDescription('Altera o tamanho da fila (OPCIONAL)'))
        .addStringOption((option) => option.setName("modo")
            .setDescription('Altera o modo de jogo da fila (OPCIONAL)')
            .setChoices([
                {
                    name: 'Battle Royale/OG',
                    value: 'br'
                },
                {
                    name: 'Outros (ballistic, criativo, etc.)',
                    value: 'outros'
                }
            ])),

    async execute(interaction, db, client) {
        const cargos = interaction.member.roles.cache
        if (!cargos.some(role => role.name === "Dono") && !cargos.some(role => role.name === "Administradores") && !cargos.some(role => role.name === "Moderadores") && !cargos.some(role => role.name === "Mods da Twitch")) {
            interaction.reply({ content: "Apenas cargos de moderação podem usar esse comando", ephemeral: true })

            return
        }
        if (interaction.options.getString('tamanho-fila') != null) {
            db.TamanhoFila = interaction.options.getString('tamanho-fila')
        }
        if (interaction.options.getString('modo') != null) {
            db.Modo = interaction.options.getString('modo')
        }


        db.EspacosFila = db.TamanhoFila


        const save = YAML.dump(db)
        fs.writeFileSync("./src/db/db.yaml", save, function (err, file) {
            if (err) throw err;
            console.log(err)
        })
        interaction.reply({ content: "Aberto!", ephemeral: true })
    }
}