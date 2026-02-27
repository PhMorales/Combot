const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const YAML = require("js-yaml")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("memes-vistos")
        .setDescription("Atualiza a quantidade de memes na lista, baseado em quantos foram vistos")
        .addNumberOption((option) => option.setName("valor")
            .setDescription('Insira o valor de memes vistos')
            .setRequired(true)),

    async execute(interaction, db, client) {
        const cargos = interaction.member.roles.cache
        if (!cargos.some(role => role.name === "Dono") && !cargos.some(role => role.name === "Administradores") && !cargos.some(role => role.name === "Moderadores") && !cargos.some(role => role.name === "Mods da Twitch")) {
            interaction.reply({ content: "Apenas cargos de moderação podem usar esse comando", ephemeral: true })

            return
        }


        const value = interaction.options.getNumber('valor')
        const dbValue = db.MemesLista
        db.MemesLista -= value
        const lista = db.MemesLista
        if (lista < 0) {
            db.MemesLista = dbValue
            interaction.reply({ content: "A quantidade de memes vistos não pode ser maior que a quantidade na lista", ephemeral: true })
            return
        }

        const save = YAML.dump(db)
        fs.writeFileSync("./src/db/db.yaml", save, function (err, file) {
            if (err) throw err;
            console.log(err)
        })
        interaction.reply({ content: "Atualizado com sucesso! (Vai levar um tempinho pra aparecer ali em cima)", ephemeral: true })

    }
}