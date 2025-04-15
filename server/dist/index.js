import express from "express";
import "dotenv/config";
import ejs from "ejs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import Routes from "./routes/index.js";
import fileUpload from "express-fileupload";
import os from "os";
import { Server } from "socket.io";
import { createServer } from "http";
import helmet from "helmet";
// Import email queue
import "./jobs/index.js";
import { emailQueue } from "./jobs/Emailjob.js";
import { appLimitter } from "./config/rateLimit.js";
import { setupSocket } from "./socket.js";
const app = express();
const PORT = process.env.PORT || 7000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_APP_URL,
    },
});
export { io };
setupSocket(io);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(appLimitter);
app.use(cors());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
}));
app.use(express.static("public"));
// * Set View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
// * Routes
app.use(Routes);
// Root route handler - using correct handler syntax
app.get("/", (req, res) => {
    // Remove async if not needed or handle properly if it is
    try {
        const html = ejs
            .renderFile(path.join(__dirname, "./views/emails/welcome.ejs"), {
            name: "Amrendra Singh",
        })
            .then((renderedHtml) => {
            emailQueue
                .add("email-job", {
                to: "leostereo1108@gmail.com",
                subject: "Testing Queue Email",
                body: renderedHtml,
            })
                .then(() => {
                res.json({ msg: "Email sent successfully" });
            })
                .catch((error) => {
                console.error("Error sending email:", error);
                res
                    .status(500)
                    .json({ msg: "Failed to send email", error: String(error) });
            });
        });
    }
    catch (error) {
        console.error("Error rendering template:", error);
        res
            .status(500)
            .json({ msg: "Failed to render template", error: String(error) });
    }
});
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
