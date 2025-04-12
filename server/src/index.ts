import express, { Application, Request, Response } from "express";
import "dotenv/config";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const app: Application = express();
const PORT = process.env.PORT || 7000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.get("/", async (_req: Request, res: Response) => {
//   try {
//     const html = await ejs.renderFile(
//       path.join(__dirname, "views", "emails", "welcome.ejs"),
//       { name: "Amrendra Singh" }
//     );

//     await sendEmail("samise4960@ptiong.com", "Testing SMTP", html);
//     return res.json({ msg: "Email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return res.status(500).json({ msg: "Failed to send email" });
    //   }
    return res.send("Hello world")
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
