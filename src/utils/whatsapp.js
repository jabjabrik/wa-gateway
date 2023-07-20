import qrcode from 'qrcode-terminal';
import WAWebJS from 'whatsapp-web.js'
const { Client, LocalAuth } = WAWebJS;

export const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './src/session',
        clientId: "client-one"
    })
})

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
})

client.on('ready', () => {
    console.log("WhatsApp is ready!!")
});

client.on('message', async message => {
    message.reply(message.body);
});