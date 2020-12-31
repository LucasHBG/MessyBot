function messageAll(guildMembers, text) {
  for (let index = 0; index < guildMembers.length; index++) {
    if (!guildMembers[index].user.bot) guildMembers[index].user.send(text);
  }
}

async function getGuild(message, text) {
  //let guildID = message.guild.id;
  let guildMembers;
  guildMembers = await message.guild.members.fetch().then((gm) =>
    gm.map((m) => {
      return m;
    })
  );

  messageAll(guildMembers, text);
}

async function sendSpam(taggedUser, text) {
  let rejectedUsers = [];
  await taggedUser.send(text).catch((error) => {
    console.log(error);
    rejectedUsers.push(taggedUser.id);
  });
  return rejectedUsers;
}

//function messageRole(guildMembers, text) {}

module.exports = {
  name: "spam",
  description:
    "Mencione um membro ou seu cargo pra spammar no PV dele.\nExemplo 1 - mencionando um usuário: *!spam @usuario 5 Oi Amigo*\nExemplo 2 - mencionando todos membros de um cargo: *!spam @nomecargo 5 Vamos jogar!!!*",
  usage: "@[cargo ou membro] [numero de mensagens] [texto personalizado]",
  guildOnly: true,
  async execute(message, args) {
    if (message.mentions.everyone) {
      let text = args.slice(1, args.length).join(" ");
      text = text.length > 0 ? text : "R-Roi?? 😳😳";

      getGuild(message, text);
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

    let msgSuccess = true;
    let rejectedUsers = [];
    /*
      Utiliza do tamanho do vetor de usuários mencionados para determinar
      a posição do argumento com o número de mensagens
    */
    let value = Number.isNaN(parseInt(args[taggedUser.length]))
      ? 5
      : parseInt(args[taggedUser.length]);

    if (value > 500) {
      message.reply(
        "Reduzi o número de mensagens para 500, pois o limite máximo foi alcançado!"
      );
    }

    //Removo os usuários mencionados e o número de mensagens para que nao apareçam na mensagem
    let text = args.slice(taggedUser.length + 1, args.length).join(" ");
    text = text.length > 0 ? text : "R-Roi?? 😳😳";

    for (let index = 0; index < value; index++) {
      for (i = 0; i < taggedUser.length; i++) {
        if (
          //Verifica se o usuário da lista de rejeitados
          taggedUser[i].id ==
          rejectedUsers.find((userID) => {
            if (userID == taggedUser[i].id) return userID;
          })
        ) {
          msgSuccess = false;
          continue;
        }
        rejectedUsers.push(await sendSpam(taggedUser[i], text));
      }
    }

    // for(i = 0; i < rejectedUsers.length; i++){

    // }
    if (msgSuccess) message.channel.send(`⚠ Spam enviado ⚠`);
    else {
      if (rejectedUsers.length == taggedUser.length) {
        message.reply(
          `nenhum spam foi enviado! Não estou conseguindo enviar mensagens no privado deles 😭`
        );
      }
      if (rejectedUsers.length < taggedUser.length) {
        message.reply(
          `spam parcialmente enviado! Não consigo enviar mensagens para **${rejectedUsers.length} usuário(s)** no privado 😢!`
        );
      }
    }
  },
};
