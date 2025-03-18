import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSocket: User[] = [];

wss.on("connection", (socket) => {
    
    socket.on("message", (message) => {
        // message received can be string/binary
        // convert it to obj
        const parsedMessage = JSON.parse(message as unknown as string);
        if (parsedMessage.type === "join") {
            allSocket.push({
                socket,
                room: parsedMessage.payload.roomId
            })
            console.log("user joined room " + parsedMessage.payload.roomId);
        }
        if (parsedMessage.type === "chat") {
            const currentUserRoom = allSocket.find((x) => x.socket == socket)?.room;

            // broadcast the msg to all user in the same room
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].room == currentUserRoom) {
                    allSocket[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    })

    socket.on("close", () => {
        allSocket = allSocket.filter(x => x.socket !== socket);
        console.log("user disconnected");
    });
})