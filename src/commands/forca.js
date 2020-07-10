const Discord = require('discord.js');
const { dicio } = require('./dicio.json');

function getWord() {
	return dicio[Math.floor(Math.random() * dicio.length)];
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
	const gabarito = [ ...new Set(wordFixed.split('-').join('').split(/ +/).join('').split('')) ].sort();
	let censoredWord = wordFixed.split(/[a-zA-Z]/).join('_');
	const chutes = [];
	let healths = '';
	const filter = response => {
		return true;
	};
	const correctFilter = response => {
		return gabarito.some(answer => answer.toLowerCase() === response.content.toLowerCase() || response.content.toLowerCase() === 'stop' || response.content.toLowerCase() === word || response.content.toLowerCase() === wordFixed);
	};

	for (let i = 0; i < lifes; i++) {
		healths += (i < lifes - chutes.length) ? '♥️' : '🤎';
	}

	let embed = new Discord.MessageEmbed()
		.setColor('#87CEEB')
		.setTitle('Jogo da Forca')
		.setAuthor('🌪 Ablablublé 🌪', 'https://cdn.discordapp.com/avatars/730761005659062282/03a2685c6e38459264a965edf583459f.png')
		.setDescription(`Vidas: ${healths}\nPalavra(${word.split('-').join('').split(/ +/).join('').length}):\`${censoredWord.split('').join(' ')}\`\nLetras Erradas:${chutes}`);

	msg.channel.send({ embed: embed }).then(message => {
		const collector = msg.channel.createMessageCollector(filter, { max: 100 });
		collector.on('collect', m => {

			if(m.content === 'stop') {collector.stop('tilt');}
			else if(m.content === word || m.content === wordFixed) {collector.stop('mizeravi');}
			else if(m.content.length === 1 && isNaN(m.content)) {
				if(gabarito.some(answer => answer.toLowerCase() === removerAcento(m.content))) {
					// atualizar censoredWord com as letras corretas
					censoredWord = censoredWord.split('');
					for (let i = 0; i < censoredWord.length; i++) {
						const element = wordFixed.split('')[i];
						if(element === removerAcento(m.content)) censoredWord[i] = word.split('')[i];
					}
					censoredWord = censoredWord.join('');
					if(censoredWord.split(' ').join('').split('_').join().length == word.split(' ').join('').length) collector.stop('ganhou');
				}
				else if(!chutes.some(value => value === removerAcento(m.content).toUpperCase())) {
					chutes.push(removerAcento(m.content).toUpperCase());
					if(chutes.length >= lifes) collector.stop('perdeu');
				}
			}
			healths = '';
			for (let i = 0; i < lifes; i++) {
				healths += (i < lifes - chutes.length) ? '♥️' : '🖤';
			}
			embed = new Discord.MessageEmbed()
				.setColor('#87CEEB')
				.setTitle('Jogo da Forca')
				.setAuthor('🌪 Ablablublé 🌪', 'https://cdn.discordapp.com/avatars/730761005659062282/03a2685c6e38459264a965edf583459f.png')
				.setDescription(`Vidas: ${healths}\nPalavra(${word.split('-').join('').split(/ +/).join('').length}):\`${censoredWord.split('').join(' ')}\`\nLetras Erradas:${chutes}`);
			message.edit({ embed: embed });
		});
		collector.on('end', reason => {
			if(reason === 'ganhou') {msg.channel.send('Você Ganhou!');}
			else if(reason === 'mizeravi') {msg.channel.send('Você Acertou a Palavra!');}
			else if(reason === 'tilt') {msg.channel.send(`Tiltou? Não conseguiu descobrir a palavra "${word}" foi?`);}
			else if(reason === 'perdeu') {msg.channel.send(`Parece que você gastou muitas tentativas tentando acertar "${word}"...`);}

		});
	});

}

module.exports = {
	name: 'forca',
	description: 'Começa um jogo da forca.',
	aliases: ['hangman', 'fc'],
	// TODO Lukas: ajeita esse usage ai
	usage: 'start | <chute> | skip | stop | custom',
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
		if (args[0] === 'stop') {
			message.channel.send('Game over');
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