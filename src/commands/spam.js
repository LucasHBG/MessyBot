module.exports = {
    name: 'spam',
    description: 'Mencione um membro pra spammar no PV dele.',
    usage: '[numero de mensagens] [url]',
    guildOnly: true,
    execute(message, args) {

        console.log(args);
        var value = 0;
        args = (typeof args[1] === 'undefined') ? value = 5 : value = parseInt(args[1]);

        if (!message.mentions.users.size) {
            return message.reply('você precisa marcar um usuário antes de spammar ele!');
        }

        const taggedUser = message.mentions.users.first();
        var msgSuccecess = true;

        const spamLoop = async _ => {
            for (let index = 0; index < value; index++) {

                await taggedUser.send('R-Roi?? 😳😳')
                    .catch(error => {
                        console.error(`Não consegui enviar no PV para ${message.author.tag}.\n`, error);
                        msgSuccecess = !msgSuccecess;
                    });

                if (args[2] !== 'undefined')
                    await taggedUser.send({
                        files: ['https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.kym-cdn.com%2Fentries%2Ficons%2Foriginal%2F000%2F024%2F207%2Fbrainlettttt.jpg&f=1&nofb=1']
                    })
                        .then(console.log)
                        .catch(error => {
                            console.error(`Não consegui enviar imagem no PV para ${message.author.tag}.\n`, error);
                            msgSuccecess = !msgSuccecess;
                        })
            }
        }

        if (!msgSuccecess)
            message.reply(`parece que não consigo enviar mensagens para **${taggedUser.username}** no PV!`);

        message.channel.send(`⚠ Spam enviado ⚠`);
    },
};