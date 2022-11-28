let users = []

// const EditData = (data, id, call) => {
//     const newData = data.map(item => item.id === id ? {...item, call} : item)
//     return newData
// }
const EditData = (data, id, call) => {
    const newData = data.map(item =>
        item.id === id ? {...item, call} : item
    )
    return newData;
}
const SocketServer = (socket) => {

    socket.on("joinUser", user => {
        const findUser = users.find(el => el.id === user._id)
        if (findUser) return
        users.push({id: user._id, socketId: socket.id, followers: user.followers})

    })
    socket.on("disconnect", () => {
        const data = users.find(user => user.socketId === socket.id)
        if (data) {
            const clients = users.filter(user => {
                return data.followers.find(item => item === user.id)
            })
            if (clients.length > 0) {
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit("checkUserOffline", data.id)
                })
            }
        }

        users.filter(user => user.socketId !== socket.id)
    })
    socket.on("likePost", newPost => {
        let ids = [...newPost.post.user.followers, newPost.post.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("likeToClient", {newPost})
            })
        }
    })
    socket.on("unLikePost", newPost => {
        let ids = [...newPost.post.user.followers, newPost.post.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("unLikeToClient", {newPost})
            })
        }
    })
    socket.on("createComment", newComment => {
        let ids = [...newComment.newComment.user.followers, newComment.newComment.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("createCommentToClient", newComment)
            })
        }
    })
    socket.on("removeComment", comment => {
        let ids = [...comment.post.user.followers, comment.post.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("removeCommentToClient", comment)
            })
        }
    })
    socket.on("createNotify", (notify) => {
        const clients = users.filter(user => notify.recipients.includes(user.id))
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("notifyToClient", notify)
            })
        }
    })
    socket.on("removeNotify", (notify) => {
        const clients = users.filter(user => notify.recipients.includes(user.id))
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("removeNotifyToClient", notify)
            })
        }
    })
    socket.on("addMessage", (message) => {
        const user = users.find(user => user.id === message.recipient)
        user && socket.to(`${user.socketId}`).emit("addMessageToClient", message)
    })
    socket.on("checkUserOnline", (data) => {
        const following = users.filter(user =>
            data.following.find(item => item === user.id)
        )

        socket.emit("checkUserOnlineToMe", following)

        const clients = users.filter(user =>
            data.followers.find(item => item === user.id)
        )

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("checkUserOnlineToClient", data._id)
            })
        }
    })



    socket.on('callUser', data => {
        users = EditData(users, data.sender, data.recipient)

        const client = users.find(user => user.id === data.recipient)

        if(client){
            if(client.call){
                socket.emit('userBusy', data)
                users = EditData(users, data.sender, null)
            }else{
                users = EditData(users, data.recipient, data.sender)
                socket.to(`${client.socketId}`).emit('callUserToClient', data)
            }
        }
    })


}
export default SocketServer