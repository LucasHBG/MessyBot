module.exports = {
    name: 'cargo',
    description: 'Cria um cargo para você mesmo.',
    aliases: ['role'],
    usage: '[nome do cargo]',
    guildOnly: true,
    execute(message, args) {

        const data = [];

        if (!args.length) {
            data.push('Aqui está uma lista com todos os meus comandos de ajuda:');
            data.push('**' + commands.map(command => ' -> !help ' + command.name).join(', \n') + '**');
            data.push(`Você também pode enviar \`${PREFIX}help [nome do comando]\` para ter informações sobre um comando!`);

            return message.channel.send(data, { split: true });
        }

        var nomeCargo = args.slice(0, args.length).join(' ');
        console.log('Texto: ' + nomeCargo);
        // Create a new role with data and a reason
        message.guild.roles.create({
            data: {
                name: '👻 ' + nomeCargo + ' 👻',
                color: 'BLUE',
                hoist: true,
                position: 1,
            },
            reason: 'porque é evento de Halloween no servidor!',
        })
            .then(d => {
                message.member.roles.add(d);
            })
            .catch(console.error);

        var removeCargoSemFantasia = message.member.guild.roles.cache.find((r) => r.name === '👽 Sem fantasia 👽');
        message.member.roles.remove(removeCargoSemFantasia)
            .catch(console.error);
    }

};//end module