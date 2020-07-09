const { dicio } = require('./dicio.json');

function getWord(){
	return dicio[Math.floor(Math.random() * dicio.length)];
}


module.exports = {
    name: 'forca',
    description: 'Começa um jogo da forca.',
	aliases: ['hangman'],
	//TODO Lukas: ajeita esse usage ai
	usage: 'start | <chute> | skip | stop | custom',
    execute(message, args) {
		if(args[0] == 'start'){
			
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