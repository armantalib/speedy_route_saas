import { io } from "socket.io-client";
import { socketUrl } from "./myAxios";

const socket = io(socketUrl, {
  transports: ["websocket"],
});

const token = localStorage.getItem('token')
 socket.on('connect', () => {
      console.log('✅ Socket connected');
      socket.emit('authenticate', token);
    });

export default socket;