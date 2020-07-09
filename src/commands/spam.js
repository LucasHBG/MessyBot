module.exports = {
    name: 'spam',
    description: 'Mencione um membro pra spammar no DM dele (but not really yet).',
    guildOnly: true,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('você precisa marcar um usuário antes de spammar ele!');
		}

		const taggedUser = message.mentions.users.first();

		message.channel.send(`Você tentou spammar: ${taggedUser.username}`);
	},
};