const io = require("socket.io")(8382);

const userId = [];
const userConn = [];

function remove(e) {
    let i = userId.indexOf(e);

    if (i > -1) {
        userId.splice(i, 1);
    }
}

io.on("connection", async (socket) => {
    console.clear();

    socket.on("start-connection", () => {

        if (!userId.includes(socket.id)) {

            userId.push(socket.id);
        }

        if (userId.length == 2) {

            socket.to(userId[0]).emit("connection-successful", socket.id);
            socket.emit("connection-successful", userId[0]);
            let socketId = socket.id;
            let socketId2 = userId[0];
            userConn.push({
                socketId: socketId2,
                socketId2: socketId
            });

            while (userId.length > 0) {
                userId.pop();
            }
        }
        else {
            socket.emit("waiting-for-connection");
            console.log("waiting for a Stranger to connect.......");
        }

        console.log(userId, userConn);
    });

    socket.on("message-sent", (message, roomId) => {
        message = String(message);
        io.to(roomId).emit("message-received", message);
        console.log("message: ", message);
    });

    socket.on("disconnect", () => {
        let id = null;
        remove(socket.id);
        console.log(userId);
        userConn.forEach(conn => {
            if (conn["socketId"] == socket.id) {
                id = conn["socketId2"];
                remove(id);
                console.log(id);
                let index = userConn.indexOf(conn);
                userConn.splice(index, 1);
                return;
            }
            else if (conn["socketId2"] == socket.id) {
                id = conn["socketId"];
                remove(id);
                console.log(id);
                let index = userConn.indexOf(conn);
                userConn.splice(index, 1);
                return;
            }
        });

        io.to(id).emit("stranger-disconnected");
        console.log("gaya: ", socket.id)
    });

    socket.on("stranger-disconnected", () => {
        let id = null;
        remove(socket.id);
        userConn.forEach(conn => {
            if (conn["socketId"] == socket.id) {
                id = conn["socketId2"];
                remove(id);
                console.log(id);
                let index = userConn.indexOf(conn);
                userConn.splice(index, 1);
                return;
            }
            else if (conn["socketId2"] == socket.id) {
                id = conn["socketId"];
                remove(id);
                console.log(id);
                let index = userConn.indexOf(conn);
                userConn.splice(index, 1);
                return;
            }
        });
        io.to(id).emit("stranger-disconnected");

        console.log(userId, userConn);
        console.log("gaya: ", socket.id)
    });

});
