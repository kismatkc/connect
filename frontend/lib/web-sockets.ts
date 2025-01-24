import io from "socket.io-client";

export const socketInstance = io(
  "https://connectbackend.unfiltereddopamine.com",
  {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,

    transports: ["websocket", "polling"],
  }
);
// export const socketInstance = io("http://localhost:4000", {
//   autoConnect: false,
// });
// export const socketInstance = io(
//   "https://96283587-40ff-470f-a4ea-4f30bdcaad52-00-care00ttvfz8.spock.replit.dev:3000",

//   {
//     autoConnect: false,
//   },
// );
