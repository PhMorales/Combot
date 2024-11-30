const fs = require("fs");
const YAML = require("js-yaml")
const { EmbedBuilder } = require('discord.js')


async function Verify(reaction, client, db, user) {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error("Algo deu errado: ", error)
            return
        }
    }

    if (reaction.emoji.name === "⭐" || reaction.emoji.name === "🔊") {
        if (reaction.count != 1) return

        memes = client.channels.cache.find(channel => channel.name === "🤣・memes").id
        memes_verificados = client.channels.cache.find(channel => channel.name === "🤣・memes-verificados").id

        if (reaction.message.channelId === memes) {
            const embed = new EmbedBuilder().setColor('Random').setTitle("Ir para o meme!").setAuthor({
                'name': `${reaction.message.author.displayName}`
                , iconURL: `${reaction.message.author.avatarURL()}`
            })
            if (reaction.emoji.name === '🔊') {
                embed.setDescription("📢 SOM ALTO!!! \n" + reaction.message.content)
            } else {
                if (reaction.message.content) {
                    embed.setDescription(reaction.message.content)
                }
            }

            embed.setURL(`${reaction.message.url}`)
            if (reaction.message.attachments.size > 0) {

                client.channels.cache.get(`${memes_verificados}`).send("⫦--------------------⫣")
                setTimeout(() => {
                    client.channels.cache.get(`${memes_verificados}`).send({ embeds: [embed] })
                }, 100);
                setTimeout(() => {
                    client.channels.cache.get(`${memes_verificados}`).send({ files: [{ attachment: `${reaction.message.attachments.first().proxyURL}` }] })
                }, 100);
                db.MemesLista += 1
                const save = YAML.dump(db)
                fs.writeFileSync("./src/db/db.yaml", save, function (err, file) {
                    if (err) throw err;
                    console.log(err)
                })


            } else {

                reaction.message.react("❌")
                setTimeout(() => {
                    reaction.message.reactions.removeAll()
                }, 1000);
            }



        }
    } else return
}

module.exports = { Verify }