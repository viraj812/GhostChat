// const socket = io("https://stranger-chat-server.onrender.com/", { transports: ['websocket', 'polling', 'flashsocket'] });

var token = null;

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
  }

const auth_key_file = loadFile("./etc/secrets/auth_key.txt");

console.log(auth_key_file);

const socket = io("https://stranger-chat-server.onrender.com/", { transports: ['websocket', 'polling', 'flashsocket'], auth: { token: client_token } });

var p = document.getElementById("connection_status");

var btnSend = document.getElementById("btnSend");

var btnStartStop = document.getElementById("btnStartStop");

const waiting_msg = "Waiting for a Stranger to Connect.......";
const disconnected_msg = "Stranger has Vanished";
const connected_msg = "Stranger Connected";
const me = "You";
const stranger = "Stranger";

var roomId = null;

socket.on("connect", () => {

    socket.on("waiting-for-connection", conn => {
        console.log("waiting for a Stranger to connect.......");
        p.innerText = waiting_msg;
    });
    
    socket.on("connection-successful", (id) => {
        console.log("connection done: ", id);
        p.innerText = connected_msg;
        roomId = id;
        btnSend.disabled = false;
    });
    
    socket.on("message-received", (message) => {
        console.log(message)
        var txtChats = document.getElementById("txtChats");
        var box = document.createElement("div");
        box.className = "receivedChats";
    
        var msg = document.createElement("div");
        msg.className = "msg";
    
        msg.appendChild(document.createTextNode(message));
    
        box.appendChild(msg);
        
        var identity = document.createElement("div");
        identity.className = "identity";
        identity.appendChild(document.createTextNode(stranger));
        box.appendChild(identity);
        
        txtChats.appendChild(box);
        
        txtChats.scrollTop = txtChats.scrollHeight;
    });
    
    socket.on("stranger-disconnected", () => {
        roomId = null;
        p.innerText = disconnected_msg;
        btnStartStop.value = "Start";
        btnSend.disabled = true;
    });
});


function sendMsg() {
    var txtMsg = document.getElementById("txtMsg");
    var validated_msg = String(txtMsg.value);
    if(validated_msg != ""){
        socket.emit("message-sent", validated_msg, roomId);

        var txtChats = document.getElementById("txtChats");
        var box = document.createElement("div");
        box.className = "sentChats";
        
        
        var msg = document.createElement("div");
        msg.className = "msg";
        
        msg.appendChild(document.createTextNode(validated_msg));
        
        box.appendChild(msg);
        txtChats.appendChild(box);

        var identity = document.createElement("div");
        identity.className = "identity";
        identity.appendChild(document.createTextNode(me));
        box.appendChild(identity);

        txtChats.scrollTop = txtChats.scrollHeight;

        txtMsg.value = "";
    }
}


function startStopConnection(){

    if(btnStartStop.value == "Start"){
        socket.emit("start-connection");
        btnStartStop.value = "Stop";
    }
    else {
        btnStartStop.value = "Start";
        btnSend.disabled = true;
        p.innerText = "Stopped";
        socket.emit("stranger-disconnected");
    }
}




