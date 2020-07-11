module.exports = {
    name: 'spam',
    description: 'Mencione um membro pra spammar no PV dele.',
    usage: '[numero de mensagens] [url]',
    guildOnly: true,
    execute(message, args) {

        var value = 0;
        args = (typeof args[1] === 'undefined') ? value = 5 : value = parseInt(args[1]);

        if (!message.mentions.users.size) {
            return message.reply('você precisa marcar um usuário antes de spammar ele!');
        }

        const taggedUser = message.mentions.users.first();
        var msgSuccecess = true;

        for (let index = 0; index < value; index++) {
            taggedUser.send('R-Roi?? 😳😳')
                .catch(error => {
                    console.error(`Não consegui enviar no PV para ${message.author.tag}.\n`, error);
                    msgSuccecess = !msgSuccecess;
                });
            new MessageAttachment(url);
        }

        if (!msgSuccecess)
            message.reply(`parace que não consigo enviar mensagens para **${taggedUser.username}** no PV!`);

        message.channel.send(`⚠ Spam enviado ⚠`);
    },
};