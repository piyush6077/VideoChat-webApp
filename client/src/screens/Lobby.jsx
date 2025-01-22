import React, { useCallback, useState } from 'react'
import { useSocket } from '../context/SocketProvider'

const LobbyScreen = () => {
  const [email, setEmail] = useState('')
  const [room , setRoom] = useState('')

  const socket = useSocket()
  console.log(socket)

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault()
    socket.emit('room:join', {email, room})
  },[email, room , socket])

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="name"></label>
        <input 
          type="text" 
          name="name" 
          placeholder='name' 
          onChange={e=>setEmail(e.target.value)}
          />
        <label htmlFor="room"></label>
        <input 
          type="text" 
          name="room" 
          placeholder='Room No' 
          onChange={e=>setRoom(e.target.value)}
        />
        <button type='submit'>Join</button>
      </form>
    </div>
  )
}

export default LobbyScreen
