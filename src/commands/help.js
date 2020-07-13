const { PREFIX } = process.env

module.exports = {
    name: 'help',
    description: 'Informa sobre as funcionalidades do bot.',
    aliases: ['commands', 'ajuda', 'comandos', 'menu'],
    usage: '[nome do comando]',
    execute(message, args) {

        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Aqui está uma lista com todos os meus comandos de ajuda:');
            data.push('**' + commands.map(command => ' -> !help ' + command.name).join(', \n') + '**');
            data.push(`Você também pode enviar \`${PREFIX}help [nome do comando]\` para ter informações sobre um comando!`);

            return message.channel.send(data, { split: true });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) return;

        data.push(`**Nome:** ${command.name}`);

        if (command.aliases) data.push(`**Semelhantes:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Descrição:** ${command.description}`);
        if (command.usage) data.push(`**Uso:** ${PREFIX}${command.name} ${command.usage}`);

        message.channel.send(data, { split: true });
    }

};//end module