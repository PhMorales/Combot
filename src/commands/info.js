const fs = require("fs");
const YAML = require("js-yaml")


async function Info(interaction, client, db) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'opa') {
        interaction.reply("Eae, como você tá?")
    }
    if (interaction.commandName === 'sobre') {
        const embed = new EmbedBuilder().setColor('Random')
        const select = interaction.options.get('escolha').value

        if (select === 'bot') {
            embed.setTitle('ComBot');
            embed.setDescription("Salve, sou o ComBot, um bot feito pelo Combo pra fazer... n sei exatamente, mas tamo ai e é isso");
            interaction.reply({ embeds: [embed] })

        }
        if (select === 'criador') {
            embed.setTitle('Combo');
            embed.setDescription("Salve, sou o Combo, eu sou uma pessoa q existe nesse mundão de meu deus e eu fiz esse bot pra... verificar memes? acho q isso é oq mais responde");

            interaction.reply({ embeds: [embed] })


        }
    }
    if (interaction.commandName === 'memesvistos') {
        const cargos = interaction.member.roles.cache
        if (!cargos.some(role => role.name === "Administradores") && !cargos.some(role => role.name === "Moderadores") && !cargos.some(role => role.name === "Mods da Twitch")) {
            interaction.reply({ content: "Apenas cargos de moderação podem usar esse comando", ephemeral: true })

            return
        }


        const value = interaction.options.get('valor').value
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


module.exports = { Info }
