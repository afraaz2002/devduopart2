import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import MySQLStore from "express-mysql-session";


// Convert __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// ✅ Middleware (Order Matters!)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Session Middleware (Move it BEFORE routes!)
app.use(
  session({
    secret: "adengeppa2per", // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Set EJS as view engine
app.set("view engine", "ejs");

// ✅ Routes (AFTER session middleware)
import indexRoutes from "./routes/index.js";
app.use("/", indexRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🚀`);
});
