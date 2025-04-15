import { votingQueue, votingQueueName } from "./jobs/VotingQueue.js";
import { commentQueue, commentQueueName } from "./jobs/CommentQueue.js";
export function setupSocket(io) {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
        // * Listen every emit
        socket.onAny(async (eventName, data) => {
            if (eventName.startsWith("rumouring-")) {
                console.log(data);
                await votingQueue.add(votingQueueName, data);
                socket.broadcast.emit(`rumouring-${data?.rumourId}`, data);
            }
            else if (eventName.startsWith("rumouring_comment")) {
                await commentQueue.add(commentQueueName, data);
                socket.broadcast.emit(`rumouring_comment-${data?.id}`, data);
                console.log("The data is", data);
            }
        });
    });
}
