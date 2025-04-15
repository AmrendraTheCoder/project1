import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import prisma from "../config/database.js";

export const commentQueueName = "commentQueue";

export const commentQueue = new Queue(commentQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueOptions,
    delay: 500,
  },
});

// * Workers
export const handler = new Worker(
  commentQueueName,
  async (job: Job) => {
    const data = job.data;
    await prisma.rumourComments.create({
      data: {
        comment: data?.comment,
        rumour_id: Number(data?.id),
      },
    });
  },
  { connection: redisConnection }
);
