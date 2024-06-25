const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const validator = require('validator');
const http = require('http');
const socketIo = require('socket.io');
const UserRouter = require("./Routes/UserRoutes");

dotenv.config();

const connectDB = require("./config/db");
const Message = require('./models/Messages');
const UserModel = require('./models/User');

connectDB();
const rooms = ['general', 'tech', 'finance', 'crypto'];
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/users", UserRouter);

const server = require("http").createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});




app.get('/rooms', (req, res) => {
    res.json(rooms);
});

async function getLastMessagesFromRoom(room) {
    let roomMessages = await Message.aggregate([
        { $match: { to: room } },
        { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } }
    ]);
    return roomMessages;
}

function sortroomMessagesByDate(messages) {
    return messages.sort((a, b) => {
        if (!a._id || !b._id) {
          
            return !a._id ? 1 : -1;
        }

        let date1 = a._id.split("/");
        let date2 = b._id.split("/");

        date1 = date1[2] + date1[0] + date1[1];
        date2 = date2[2] + date2[0] + date2[1];

        return date1 < date2 ? -1 : 1;
    });
}

///socket connection
io.on('connection', (socket) => {
    socket.on('new-user', async () => {
        const members = await UserModel.find();
        io.emit('new-user', members);
    });

    socket.on('join-room', async (room) => {
        socket.join(room);
        let roomMessages = await getLastMessagesFromRoom(room);

        roomMessages = sortroomMessagesByDate(roomMessages);

        socket.emit('room-messages', roomMessages);
    });

    socket.on('message-room', async (room, content, sender, time, date) => {
        console.log(content);
        await Message.create({ content, from: sender, time, date, to: room });
        let roomMessages = await getLastMessagesFromRoom(room);
        roomMessages = sortroomMessagesByDate(roomMessages);
        io.to(room).emit('room-messages', roomMessages);
        socket.broadcast.emit('notifications', room);
    });
    app.delete("/logout" , async function(req,res)
{
    try{
       const {_id , newMessages} = req.body
       const user = await UserModel.findById(_id)
       user.status = "offline";
       user.newMessages = newMessages
       await user.save();
       const members = await UserModel.find()
       socket.broadcast.emit('new-user',members)
       res.status(200).send();
    }
    catch(error)
    {
        console.log(error)
        res.status(400).send()
    }
})
});



server.listen(5001, () => {
    console.log("Listening to server");
});
