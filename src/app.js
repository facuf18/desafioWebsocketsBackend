import express from 'express';
import { Server } from 'socket.io';
import __dirname from './utils.js';

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public/home'));

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
const io = new Server(server);

const chatLog = [];
const products = []; 
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');
    socket.emit('chat log', chatLog);
    socket.on('chat message', (data) => {
        chatLog.push(data);
        io.emit('chat log', chatLog);
    });
    socket.emit('products log', products);
    socket.on('new product', (data) => {
        products.push(data);
        io.emit('products log', products);
    });
});