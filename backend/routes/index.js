import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM test");
    res.render("index", { users: rows });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Database error" });
  }
});

router.post('/login',async(req,res)=>{
    const { email,password } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    
        if (rows.length === 0) {
          req.flash("error", "Invalid email or password");
          return res.redirect("/login");
        }
    
        const user = rows[0];
        const isMatch = password == user.password;
    
        if (!isMatch) {
          req.flash("error", "Invalid email or password");
          return res.redirect("/login");
        }
    
        // Store user in session
        req.session.user = user;
        res.redirect("/dashboard"); // Redirect to dashboard after login
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if user already exists
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  
      if (existingUser.length > 0) {
        return res.render("register", { message: "Email already registered!" });
      }
  
      // Hash Password
    //   const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into database
      await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        username,
        email,
        password,
      ]);
  
      res.redirect("/login");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

export default router;
