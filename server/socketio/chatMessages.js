module.exports = (socket, io) => {

    socket.emit("newMessage", "Hey, whats up?")
}