import { Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import prisma from "../config/database.js";
export const votingQueueName = "votingQueue";
export const votingQueue = new Queue(votingQueueName, {
    connection: redisConnection,
    defaultJobOptions: {
        ...defaultQueueOptions,
        delay: 500,
    },
});
// * Workers
export const handler = new Worker(votingQueueName, async (job) => {
    const data = job.data;
    await prisma.rumourItem.update({
        where: {
            id: Number(data?.rumourItemId),
        },
        data: {
            count: {
                increment: 1,
            },
        },
    });
}, { connection: redisConnection });
