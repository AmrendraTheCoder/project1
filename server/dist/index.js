import express from "express";
import "dotenv/config";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const PORT = process.env.PORT || 7000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
app.get("/", async (_req, res) => {
    try {
        const html = await ejs.renderFile(path.join(__dirname, "./views/emails/welcome.ejs"), { name: "Amrendra Singh" });
        // await sendEmail("leostereo1108@gmail.com", "Testing SMTP", html);
        await emailQueue.add(emailQueueName, {
            to: "leostereo1108@gmail.com",
            subject: "Testing Queue Email",
            body: html,
        });
        return res.json({ msg: "Email sent successfully" });
    }
    catch (error) {
        console.error("Error sending email:", error);
        return res
            .status(500)
            .json({ msg: "Failed to send email", error: String(error) });
    }
});
// * Queues
import "./jobs/index.js";
import { emailQueue, emailQueueName } from "./jobs/Emailjob.js";
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
