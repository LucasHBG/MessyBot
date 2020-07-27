const Discord = require('discord.js');

async function messageAll(guildMembers, text) {

    for (let index = 0; index < guildMembers.length; index++) {
        
        if (!guildMembers[index].user.bot)
            (guildMembers[index].user).send(text);
    }
}

async function GetGuild(message, text) {
    //var guildID = message.guild.id;
    var guildMembers;
    guildMembers = await message.guild.members.fetch().then(gm => gm.map(m => {
        return m;
    }));

    messageAll(guildMembers, text);
}

module.exports = {
    name: 'spam',
    description: 'Mencione um membro ou seu cargo pra spammar no PV dele.',
    usage: '[numero de mensagens] [texto personalizado]',
    guildOnly: true,
    async execute(message, args) {

        var msgSuccecess = true;
        var value = Number.isNaN(parseInt(args[1])) ? 5 : parseInt(args[1]);

        if (message.mentions.everyone === true) {

            var text = args.slice(1, args.length).join(' ');
            text = (text.length > 0) ? text : 'R-Roi?? 😳😳';

            GetGuild(message, text);
        }

        if (!message.mentions.users.size && message.mentions.everyone === false)
            return message.reply('você precisa marcar um usuário ou seu cargo antes de spammar ele!');

        if (!message.mentions.users.size && message.mentions.everyone === true) return;

        const taggedUser = message.mentions.users.first();

        if (value > 1000) {
            message.reply('Reduzi o número de mensagens para 1000, pois o limite máximo[1000] foi alcançado!');
        }

        var text = args.slice(2, args.length).join(' ');
        text = (text.length > 0) ? text : 'R-Roi?? 😳😳';

        for (let index = 0; index < value; index++) {

            await taggedUser.send(text)
                .catch(error => {
                    console.error(`Não consegui enviar no PV para ${message.author.tag}.\n`, error);
                    msgSuccecess = !msgSuccecess;
                });

        }

        msgSuccecess ?
            message.channel.send(`⚠ Spam enviado ⚠`) :
            message.reply(`parece que não consigo enviar mensagens para **${taggedUser.username}** no PV!`);
    },
};