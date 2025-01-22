import React , {createContext, useContext, useMemo} from "react";
import {io} from 'socket.io-client'

const SocketContext = createContext(null);

export const useSocket = () =>{
    const socket = useContext(SocketContext)
    return socket
}

export const SocketProvider = (props) => { 
    const socket = useMemo(()=> io('localhost:8000'), [])
    // useMemo is used to prevent the socket from being created multiple times
    // If we don't use useMemo, then the socket will be created multiple times
    return (
    <SocketContext.Provider value={socket}>
        {props.children}
    </SocketContext.Provider>
    )   
}
