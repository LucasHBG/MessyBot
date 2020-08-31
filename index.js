const fs = require('fs');

// require the discord.js module
const Discord = require('discord.js');

require('dotenv').config();
const { DISCORD_TOKEN_MESSY, DISCORD_TOKEN_JOTARO_KUJO, PREFIX } = process.env

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.name, command);
}



client.once('ready', () => {
    console.log('Online!');

    client.user.setActivity('R-Roi?? 😳😳 [!help]', { type: 'LISTENING' })

}); //end client.once ready

//Handle for every messages
client.on('message', message => {

    if (message.author.bot) return;

    if (message.author == client.user) return;

    /*
        Get the user command "![command]"
    */
    var args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Não posso executar esse comando em DMs...');
    }

    if (command.args && !args.length) {
        let reply = `Você não me passou argumentos, ${message.author}!`;

        if (command.usage) {
            reply += `\nO uso correto seria: \`${PREFIX}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error('ERRRRRRRRRO: ' + error);
        message.channel
            .send('Não entendi o que você quis dizer. Tente usando `!help [argumento]`. \n\nLista de argumentos: \n   about -> Comenta um pouco sobre o bot. \n   commands -> Mostra a lista de comandos do bot.');
    }
});

// login to Discord with your app's token
client.login(DISCORD_TOKEN_MESSY).catch(err => console.log("" + err));

// login to Discord with your app's token
//client.login(DISCORD_TOKEN_JOTARO_KUJO).catch(err => console.log("" + err));