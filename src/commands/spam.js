function messageAll(guildMembers, text) {
  for (let index = 0; index < guildMembers.length; index++) {
    if (!guildMembers[index].user.bot) guildMembers[index].user.send(text);
  }
}

function messageRole(guildMembers, text) {}

async function GetGuild(message, text) {
  //var guildID = message.guild.id;
  let guildMembers;
  guildMembers = await message.guild.members.fetch().then((gm) =>
    gm.map((m) => {
      return m;
    })
  );

  messageAll(guildMembers, text);
}

module.exports = {
  name: "spam",
  description:
    "Mencione um membro ou seu cargo pra spammar no PV dele.\nExemplo 1 - mencionando um usuário: *!spam @usuario 5 Oi Amigo*\nExemplo 2 - mencionando todos membros de um cargo: *!spam @nomecargo 5 Vamos jogar!!!*",
  usage: "@[cargo ou membro] [numero de mensagens] [texto personalizado]",
  guildOnly: true,
  async execute(message, args) {
    let msgSuccess = true;
    let value = Number.isNaN(parseInt(args[1])) ? 5 : parseInt(args[1]);

    if (message.mentions.everyone) {
      let text = args.slice(1, args.length).join(" ");
      text = text.length > 0 ? text : "R-Roi?? 😳😳";

      GetGuild(message, text);
    }

    if (!message.mentions.users.size && !message.mentions.everyone)
      return message.reply(
        "você precisa marcar um usuário ou cargo antes de spammar ele!"
      );

    if (!message.mentions.users.size && message.mentions.everyone) return;

    //Vetor de usuários mencionados
    const taggedUser = message.mentions.users.map((users) => {
      return users;
    });

    if (value > 500) {
      message.reply(
        "Reduzi o número de mensagens para 500, pois o limite máximo foi alcançado!"
      );
    }

    var text = args.slice(2, args.length).join(" ");
    text = text.length > 0 ? text : "R-Roi?? 😳😳";

    for (let index = 0; index < value; index++) {
      for (i = 0; i < taggedUser.length; i++)
        msgSuccess = await sendSpam(taggedUser[i], text, msgSuccess);
    }

    msgSuccess
      ? message.channel.send(`⚠ Spam enviado ⚠`)
      : message.reply(
          `parece que não consigo enviar mensagens para **${taggedUser.username}** no PV!`
        );
  },
};

async function sendSpam(taggedUser, text, msgSuccess) {
  await taggedUser.send(text).catch((error) => {
    console.log(error);
    msgSuccess = !msgSuccess;
  });
  return msgSuccess;
}
