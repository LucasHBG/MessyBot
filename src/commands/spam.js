module.exports = {
    name: 'spam',
    description: 'Mencione um membro pra spammar no PV dele.',
    usage: '[numero de mensagens] [texto personalizado]',
    guildOnly: true,
    async execute(message, args) {

        var value = Number.isNaN(parseInt(args[1])) ? 5 : parseInt(args[1]);

        if (!message.mentions.users.size)
            return message.reply('você precisa marcar um usuário antes de spammar ele!');

        const taggedUser = message.mentions.users.first();
        var msgSuccecess = true;

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