module.exports = {
    name: 'spam',
    description: 'Mencione um membro pra spammar no PV dele.',
    usage: '[numero de mensagens] [url]',
    guildOnly: true,
    async execute(message, args) {

        var value = 0;
        value = (typeof args[1] === 'undefined') ? 5 : parseInt(args[1]);

        if (!message.mentions.users.size) {
            return message.reply('você precisa marcar um usuário antes de spammar ele!');
        }

        const taggedUser = message.mentions.users.first();
        var msgSuccecess = true;

        for (let index = 0; index < value; index++) {

                await taggedUser.send('R-Roi?? 😳😳')
                    .catch(error => {
                        console.error(`Não consegui enviar no PV para ${message.author.tag}.\n`, error);
                        msgSuccecess = !msgSuccecess;
                    });

        }

        if (!msgSuccecess)
            message.reply(`parece que não consigo enviar mensagens para **${taggedUser.username}** no PV!`);

        message.channel.send(`⚠ Spam enviado ⚠`);
    },
};