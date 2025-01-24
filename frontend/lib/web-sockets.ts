import io from "socket.io-client";

export const socketInstance = io(
  "wss://connectbackend.unfiltereddopamine.com",
  {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,

    transports: ["websocket", "polling"],
  }
);
