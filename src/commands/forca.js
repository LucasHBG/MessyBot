const { dicio } = require('./dicio.json');

function getWord() {
	return dicio[Math.floor(Math.random() * dicio.length)];
}

function startGame(msg, word, lifes = 6) {

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
			data.push('**' + commands.map(command => ' -> !' + command).join(', \n') + '**');

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
2 - Comando Custom Funcional
3 - Comando de Chute Funcional


*/