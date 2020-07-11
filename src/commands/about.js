module.exports = {
    name: 'about',
    description: 'Revela o motivo da criação do bot.',
    aliases: ['sobre'],
    execute(message) {
        message.channel.send('A princípio, só pra encher o saco dos outros mesmo e jogar 👍');
    },
};