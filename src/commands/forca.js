const Discord = require('discord.js');
const { dicio } = require('./dicio.json');

function getWord() {
	return dicio[Math.floor(Math.random() * dicio.length)];
}

function startGame(msg, word, lifes = 6){
	const letrasValidas = [ ...new Set( word.split('-').join('').split(/ +/).join('').split('') ) ].sort();  
	let censoredWord = word.split(/[a-zA-Z]/).join('_ ');
	const embed = new Discord.MessageEmbed()
	.setTitle('Jogo da Forca')
	.setAuthor('🌪 Ablablublé 🌪', 'https://cdn.discordapp.com/avatars/730761005659062282/03a2685c6e38459264a965edf583459f.png')
	msg.channel.send({ embed: embed })
}

module.exports = {
	name: 'forca',
	description: 'Começa um jogo da forca.',
	aliases: ['hangman', 'fc'],
	//TODO Lukas: ajeita esse usage ai
	usage: 'start | <chute> | skip | stop | custom',
	execute(message, args) {

		const data = [];
		const commands = ['start', '<chute>', 'skip', 'stop'];

		if (!args.length) {
			data.push('Aqui está uma lista com todos os meus comandos em !forca:');
			data.push('**' + commands.map(command => ' -> !forca ' + command).join(', \n') + '**');

			return message.channel.send(data, { split: true });
		}

		if (args[1] === 'start') {
			startGame(message, getWord())
		}
		if (args[1] === 'stop') {
			message.channel.send('Game over');
		}
	},
};

/*TODO Geral
1 - Comando Start Funcional
1.1 - Leitura Respostas
1.2 - Validação de Vida
1.3 - Perder
2 - Comando de Chute Funcional
3 - Comando Skip / Stop
4 - Comando Custom Funcional


*/