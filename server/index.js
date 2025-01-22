const { Server } = require("socket.io")


const io = new Server(8000, {
    cors: true,
})

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection",(socket) => {
    console.log(`Socket Connected`, socket.id)
    // event logic
    socket.on('room:join', (data)=>{
        console.log(data)
        emailToSocketIdMap.set();
        socketIdToEmailMap.set();
    })    
})


