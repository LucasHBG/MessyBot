const Discord = require('discord.js');
const { dicio } = require('./dicio.json');

function getWord() {
	return dicio[Math.floor(Math.random() * dicio.length)];
}

function fixHealths(maxlifes, lostlifes) {
	let healths = '';
	for (let i = 0; i < maxlifes; i++) {
		healths += (i < maxlifes - lostlifes) ? '♥️' : '🖤';
	}
	return healths;
}

function removerAcento(text) {
	text = text.toLowerCase()
		.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a')
		.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e')
		.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i')
		.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o')
		.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u')
		.replace(new RegExp('[Ç]', 'gi'), 'c');
	return text;
}

function startGame(msg, word, lifes = 6) {
	const wordFixed = removerAcento(word);
	const gabarito = [...new Set(wordFixed.split('-').join('').split(/ +/).join('').split(''))].sort();
	let censoredWord = wordFixed.split(/[a-zA-Z]/).join('_');
	const chutes = [];
	let healths = '';
	const filter = () => {
		return true;
	};

	for (let i = 0; i < lifes; i++) {
		healths += (i < lifes - chutes.length) ? '♥️' : '🤎';
	}

	let embed = new Discord.MessageEmbed()
		.setColor('#87CEEB')
		.setTitle('Jogo da Forca')
		.setAuthor('🌪 Ablablublé 🌪', 'https://cdn.discordapp.com/avatars/730761005659062282/03a2685c6e38459264a965edf583459f.png')
		.setDescription(`Vidas: ${healths}\nPalavra(${word.split('-').join('').split(/ +/).join('').length}):\`${censoredWord.split('').join(' ')}\`\nLetras Erradas: \`${chutes.length == 0 ? '...' : chutes.join(', ')}\``);

	msg.channel.send({ embed: embed }).then(message => {
		const collector = msg.channel.createMessageCollector(filter, { max: 100, idle: 60000, errors: ['idle'] });
		collector.on('collect', m => {
			let keep = false;
			if(m.content === 'stop') {collector.stop('lostStop');}
			else if(m.content === word || m.content === wordFixed) {collector.stop('winWord');}
			else if(m.content.length === 1 && isNaN(m.content)) {
				if(gabarito.some(answer => answer.toLowerCase() === removerAcento(m.content))) {
					// atualizar censoredWord com as letras corretas
					censoredWord = censoredWord.split('');
					for (let i = 0; i < censoredWord.length; i++) {
						const element = wordFixed.split('')[i];
						if (element === removerAcento(m.content)) censoredWord[i] = word.split('')[i];
					}
					censoredWord = censoredWord.join('');
					if(censoredWord.split(' ').join('').split('_').join('').length == word.split(' ').join('').length) collector.stop('winSimple');
				}
				else if (!chutes.some(value => value === removerAcento(m.content).toUpperCase())) {
					chutes.push(removerAcento(m.content).toUpperCase());
					if(chutes.length >= lifes) collector.stop('lostLifes');
				}
			}
			else if(m.content.length === word.length && m.content.split(/ +/).join('').length === word.split(/ +/).join('').length) {
				// errou a palavra
				m.reply(`Você correu o grande risco de acertar uma palavra, e falhou, a palavra era **${word}**`)
			}
			else {keep = true;}
			if(!keep) m.delete({ timeout: 0, reason: 'valid game attempt' });
			if(!collector.ended) {
				healths = fixHealths(lifes, chutes.length);
				embed = embed.setDescription(`Vidas: ${healths}\nPalavra(${word.split('-').join('').split(/ +/).join('').length}): \`${censoredWord.split('').join(' ')}\`\nLetras Erradas: \`${chutes.length == 0 ? '...' : chutes.join(', ')}\``);
				message.edit({ embed: embed });
			}
		});
		collector.on('end', (collected, reason) => {
			if(reason === undefined) return;
			embed = embed.setColor(reason.startsWith('win') ? '#BFF000' : 'F2003C');

			if(reason.startsWith('lost') || reason == 'idle') {
				healths = fixHealths(lifes, lifes);

				if(reason == 'idle') message.channel.send(`Parece que esqueceram de tentar adivinhar a palavra **${word}**...`);
				else collected.last().reply(reason.endsWith('Stop') ? `Desistiu de Tentar descobrir a palavra "**${word}**" foi?` : `Ih, parece que alguem não conhece a palavra "**${word}**"`).then(m => m.react('<:KEKW:725928709856559144>'));
			}
			else {
				collected.last().reply((reason.endsWith('Simple') ? 'Acertou a ultima  de "' : 'Acertou a palavra "**') + word + '**"!');
			}

			embed = embed.setDescription(`Vidas: ${healths}\nPalavra(${word.split('-').join('').split(/ +/).join('').length}): \`${censoredWord.split('').join(' ')}\`\nLetras Erradas: \`${chutes.length == 0 ? '...' : chutes.join(', ')}\``);
			message.edit({ embed: embed });

		});
	});

}

module.exports = {
	name: 'forca',
	description: 'Começa um jogo da forca.',
	aliases: ['hangman', 'fc'],
	// TODO Lukas: ajeita esse usage ai
	usage: 'start | <chute> | skip | custom',
	execute(message, args) {
		const data = [];
		const commands = ['start', '<chute>', 'skip', 'stop'];

		if (!args.length) {
			data.push('Aqui está uma lista com todos os meus comandos em !forca:');
			data.push('**' + commands.map(command => ' -> !forca ' + command).join(', \n') + '**');

			return message.channel.send(data, { split: true });
		}
		if (args[0] === 'start') {
			startGame(message, getWord());
		}
	},
};

/* TODO Geral
1 - Comando Start Funcional
1.1 - Leitura Respostas
1.2 - Validação de Vida
1.3 - Perder
2 - Comando de Chute Funcional
3 - Comando Skip / Stop
4 - Comando Custom Funcional


*/