const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const YAML = require("js-yaml")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset-resgate")
        .setDescription("Reinicia a fila de resgates"),

    async execute(interaction, db, client) {
        const cargos = interaction.member.roles.cache
        if (!cargos.some(role => role.name === "Dono") && !cargos.some(role => role.name === "Administradores") && !cargos.some(role => role.name === "Moderadores") && !cargos.some(role => role.name === "Mods da Twitch")) {
            interaction.reply({ content: "Apenas cargos de moderação podem usar esse comando", ephemeral: true })

            return
        }
        fila = client.channels.cache.find(channel => channel.name === "🛒・fila-de-resgates").id

        try {

            db.JogadoresFila = []

            const save = YAML.dump(db)
            fs.writeFileSync("./src/db/db.yaml", save, function (err, file) {
                if (err) throw err;
                console.log(err)
            })
            interaction.reply({ content: "Fila reiniciada com sucesso!", ephemeral: true })
            client.channels.cache.get(`${fila}`)
                .send("FILA REINICIADA")
                .then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000)
                })
        } catch (e) {
            console.log(e)
            return
        }

    }
}