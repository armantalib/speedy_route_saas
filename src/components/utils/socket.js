import { io } from "socket.io-client";

const socket = io("http://192.168.100.59:8080/", {
  transports: ["websocket"],
});

const token = localStorage.getItem('token')
 socket.on('connect', () => {
      console.log('✅ Socket connected');
      socket.emit('authenticate', token);
    });

export default socket;