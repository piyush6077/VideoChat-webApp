import React, { useEffect, useState,useCallback } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const NewScreen = () => { 
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const handleRoomJoin = useCallback((e) => {
        e.preventDefault();
            socket.emit("join:room", { email, room });
            // console.log(`Joining room: ${room} with data: ${email}`);
    },
    [socket,email, room ]

);
    socket.on("user:joined", (data)=>{
        alert(data)
    })



    return (
        <div>
            <form onSubmit={handleRoomJoin}>
                <input 
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter data"
                />
                <input
                    type="number"
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Enter room number"
                />
                <button type="submit">Join</button>
            </form>
        </div>
    );
}

export default NewScreen;
