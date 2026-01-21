module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-note", (noteId) => {
      socket.join(`note-${noteId}`);
      console.log(`Socket ${socket.id} joined note-${noteId}`);
    });

    socket.on("edit-note", (data) => {
      // data: { noteId, content, userId }
      socket.to(`note-${data.noteId}`).emit("note-updated", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};