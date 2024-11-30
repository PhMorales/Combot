require('dotenv').config();
const { REST, Routes, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const commands = [{
    name: 'opa',
    description: 'Manda um eae!',
}, {
    name: 'sobre',
    description: 'Explico um pouco sobre alguém',
    options: [
        {
            name: 'escolha',
            description: 'Escolha qm será METAFORADO pelo bot',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'ComBot',
                    value: 'bot'
                },
                {
                    name: 'Combo',
                    value: 'criador'
                }
            ],
            required: true
        }
    ]

},
{
    name: 'memesvistos',
    description: 'Atualiza a quantidade de memes na lista, baseado em quantos foram vistos',
    options: [
        {
            name: 'valor',
            description: 'Insira o valor de memes vistos',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ]

}];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registrando comandos');
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands });
        console.log("Comandos Registrados");
    } catch (error) {
        console.log(`Ocorreu um erro: ${error}`)
    }
})();
