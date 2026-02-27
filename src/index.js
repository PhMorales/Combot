require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, MessageFlags, ActivityType, Partials, GatewayIntentBits, Events, Collection } = require("discord.js");
const { Verify } = require('./verify');
const { dbLoad } = require('./db/load');
const fs = require('node:fs');
const path = require('node:path');
const db = dbLoad()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    rest: {
        timeout: 30000
    }
})



client.once('ready', (c) => {
    console.log(`🟢 | O bot ${c.user.username} está Online`)
    client.user.setActivity({
        name: "os PIORES memes do #memes",
        type: ActivityType.Watching
    })
    setInterval(() => {
        const lista = db.MemesLista
        const data = new Date().getTime()
        const horario = new Date(data)
        const memes_verificados = client.channels.cache.find(channel => channel.name === "🤣・memes-verificados").id
        client.channels.cache.get(`${memes_verificados}`).setTopic(`Contagem: ${lista} (${horario.getHours()}:${horario.getMinutes().toString().padStart(2, '0')}). [Último visto](${db.UltimoMeme})`)
    }, 330000)

});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    console.log(db)
    Verify(reaction, client, db, user)

})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, db, client);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'Houve um erro ao executar o comando!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'Houve um erro ao executar o comando!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
})

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[Aviso] O comando em ${filePath} não possui um de seus componentes.`);
        }
    }
}

client.login(process.env.TOKEN);