const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Sample POST route to simulate order
app.post('/place-order', (req, res) => {
  const orderDetails = req.body;
  io.emit('newOrder', orderDetails); // Broadcast to all staff
  res.status(201).json({ message: 'Order placed', order: orderDetails });
});

io.on('connection', (socket) => {
  console.log('Staff connected:', socket.id);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

