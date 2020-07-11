const Discord = require('discord.js');
const { dicio } = require('./dicio.json');

// Função que retorna uma palavra aleatória do Dicionario
function getWord() {
	return dicio[Math.floor(Math.random() * dicio.length)];
}

// Função que retorna a string das vidas formatada, necessita o maximo de vida e o numero de vidas perdidas
function fixHealths(maxlifes, lostlifes) {
	let healths = '';
	for (let i = 0; i < maxlifes; i++) {
		healths += (i < maxlifes - lostlifes) ? '♥️' : '🖤';
	}
	return healths;
}

// Função para remover acento de palavras, assim a pessoa pode digitar errado
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

// Função para jogar, necessita a mensage original, a palavra do jogo, e o numero de vida (padrão de vidas é 6)
function startGame(msg, word, lifes = 6) {
	// Palavra sem Acentos
	const wordFixed = removerAcento(word);
	const gabarito = [...new Set(wordFixed.split('-').join('').split(/ +/).join('').split(''))].sort();
	let censoredWord = wordFixed.split(/[a-zA-Z]/).join('_');
	// Lista para as Falhas
	const chutes = [];
	// Declaração da variavel da string de vidas
	let healths = fixHealths(lifes, chutes.length);

	//Filtro inútil, para aceitar qualquer coisa que as pessoas digitam, posso corrigir, mas como vai precisar dos ifs la em baixo, decidi deixar só os de baixo
	const filter = () => {
		return true;
	};

	// Declaração do Embed
	let embed = new Discord.MessageEmbed()
		.setColor('#87CEEB')
		.setTitle('Jogo da Forca')
		.setAuthor('🌪 Ablablublé 🌪', 'https://cdn.discordapp.com/avatars/730761005659062282/03a2685c6e38459264a965edf583459f.png')
		.setDescription(`Vidas: ${healths}\nPalavra(${word.split('-').join('').split(/ +/).join('').length}):\`${censoredWord.split('').join(' ')}\`\nLetras Erradas: \`${chutes.length == 0 ? '...' : chutes.join(', ')}\``);

	// Enviar embed, e então começar a escutar as proximas 100 mensagens do canal, sendo que caso ninguem mande nada por 1 minuto, ele cancela
	msg.channel.send({ embed: embed }).then(message => {
		const collector = msg.channel.createMessageCollector(filter, { max: 100, idle: 60000, errors: ['idle'] });
		// Escuta de mensagens
		collector.on('collect', m => {
			// Variável para caso a mensagem enviada seja considerada uma de conversa, e não relacionada ao jogo
			let keep = false;
			// Caso a mensagem seja stop, cancelar jogo com retorno 'lostStop"
			if(m.content === 'stop') {collector.stop('lostStop');}
			// Caso envie a palavra correta (sem necessidade de acentuação), cancelar o jogo com retorno 'winWord' 
			else if(m.content === word || m.content === wordFixed) {collector.stop('winWord');}
			// Caso a mensagem enviada seja só uma letra, considerar que foi tentativa de acerto na forca
			else if(m.content.length === 1 && isNaN(m.content)) {
				// Checar se a letra enviada está no gabarito
				if(gabarito.some(answer => answer.toLowerCase() === removerAcento(m.content))) {
					// Atualizar censoredWord com as letras corretas
					censoredWord = censoredWord.split('');
					for (let i = 0; i < censoredWord.length; i++) {
						const element = wordFixed.split('')[i];
						if (element === removerAcento(m.content)) censoredWord[i] = word.split('')[i];
					}
					censoredWord = censoredWord.join('');
					// Caso seja a ultima letra, ganhar com retorno 'winSimple'
					if(censoredWord.split(' ').join('').split('_').join('').length == word.split(' ').join('').length) collector.stop('winSimple');
				}
				else if (!chutes.some(value => value === removerAcento(m.content).toUpperCase())) {
					chutes.push(removerAcento(m.content).toUpperCase());
					if(chutes.length >= lifes) collector.stop('lostLifes');
				}
			}
			// se enviou uma palavra com o numero de letras/espaçamentos corretos, porém a palavra está errada, considerar que tentou acertar, e errou
			else if(m.content.length === word.length && m.content.split(/ +/).join('').length === word.split(/ +/).join('').length) {
				// errou a palavra
				m.reply(`Você correu o grande risco de acertar uma palavra, e falhou, a palavra era **${word}**`)
			}
			// Mensagens comuns, não devem ser apagadas
			else {keep = true;}
			// Apagar mensagens que foram consideradas relacionadas ao jogo após 10 segundos
			if(!keep) m.delete({ timeout: 10000, reason: 'valid game attempt' });
			// Se o jogo ainda não acabou, e enviou uma mensagem, então atualizar mensagem original
			if(!collector.ended) {
				healths = fixHealths(lifes, chutes.length);
				embed = embed.setDescription(`Vidas: ${healths}\nPalavra(${word.split('-').join('').split(/ +/).join('').length}): \`${censoredWord.split('').join(' ')}\`\nLetras Erradas: \`${chutes.length == 0 ? '...' : chutes.join(', ')}\``);
				message.edit({ embed: embed });
			}
		});
		// Caso um retorno para acabar o jogo aconteça
		collector.on('end', (collected, reason) => {
			// Catch error
			if(reason === undefined) return;
			// Atualizar cor de acordo com vitória ou não
			embed = embed.setColor(reason.startsWith('win') ? '#BFF000' : 'F2003C');

			// Se for derrota ou ou inatividade, atualizar numero de vidas, e enviar mensagem.
			if(reason.startsWith('lost') || reason == 'idle') {
				healths = fixHealths(lifes, lifes);

				if(reason == 'idle') message.channel.send(`Parece que esqueceram de tentar adivinhar a palavra **${word}**...`);
				else collected.last().reply(reason.endsWith('Stop') ? `Desistiu de Tentar descobrir a palavra "**${word}**" foi?` : `Ih, parece que alguem não conhece a palavra "**${word}**"`).then(m => m.react('725928709856559144'));
			}
			// Se for vitória, enviar resposta
			else {
				collected.last().reply((reason.endsWith('Simple') ? 'Acertou a ultima  de "' : 'Acertou a palavra "**') + word + '**"!');
			}
			// Mostrar palavra no resultado
			censoredWord = word.split('').join(' ');
			// Atualizar mensagem original com alterações feitas anteriormente
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