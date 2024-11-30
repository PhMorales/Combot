require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType, Partials, GatewayIntentBits, Events } = require("discord.js");
const { Verify } = require('./commands/verify');
const { Info } = require('./commands/info');
const { dbLoadValue, dbLoad } = require('./db/load');
const db = dbLoad()


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
})



client.once('ready', (c) => {
    console.log(`🟢 | O bot ${c.user.username} está Online`)
    // o tempo desse timer tá em 1000 pq é pra testar se atualiza bonitinho, depois mudar pra 300000 na versão final
    setInterval(() => {
        const lista = db.MemesLista
        const data = new Date().toLocaleString('pt-BR', { timeZoneName: 'longOffset', timeZone: 'America/Sao_Paulo' })
        const horario = new Date(data)
        const memes_verificados = client.channels.cache.find(channel => channel.name === "🤣・memes-verificados").id
        client.channels.cache.get(`${memes_verificados}`).setTopic(`Memes para ver: ${lista} (Ultima checagem: ${horario.getHours()}:${horario.getMinutes().toString().padStart(2, '0')})`)
    }, 1000)

});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    Verify(reaction, client, db, user)

})

client.on('interactionCreate', (interaction, user) => {
    Info(interaction, client, db)
})

client.login(process.env.TOKEN);
