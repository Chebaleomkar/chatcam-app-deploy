const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded'); // Fixed typo in 'socket.broadcast.emit'
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => { // Fixed parameter structure
        io.to(userToCall).emit('callUser', { signal: signalData, from, name }); // Fixed typo in 'emit' event name
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal); // Fixed event name and parameter
    });
});

server.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`);
});
