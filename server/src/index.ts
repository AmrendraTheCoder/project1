import express, { Application, Request, Response } from "express";
import "dotenv/config";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import Routes from "./routes/index.js";
import { emailQueue, emailQueueName } from "./jobs/Emailjob.js";

const app: Application = express();
const PORT = process.env.PORT || 7000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// * Set View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

// * Routes
app.use(Routes);

app.get("/", async (_req: Request, res: Response) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "./views/emails/welcome.ejs"),
      { name: "Amrendra Singh" }
    );

    await emailQueue.add(emailQueueName, {
      to: "rohanamansharma@gmail.com",
      subject: "Testing Queue Email",
      body: html,
    });
    return res.json({ msg: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ msg: "Failed to send email", error: String(error) });
  }
});

// * Queues
import "./jobs/index.js";

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
