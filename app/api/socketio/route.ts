import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'
import { NextApiResponseServerIO } from '@/lib/socket'

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new ServerIO(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      socket.on('join-chat', (matchId) => {
        socket.join(matchId)
        console.log(`User ${socket.id} joined chat ${matchId}`)
      })

      socket.on('send-message', (data) => {
        socket.to(data.matchId).emit('receive-message', data)
      })

      socket.on('typing', (data) => {
        socket.to(data.matchId).emit('user-typing', data)
      })

      socket.on('stop-typing', (data) => {
        socket.to(data.matchId).emit('user-stop-typing', data)
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
    })
  }
  res.end()
}
