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

router.get('/login',)

router.post('/login',async(req,res)=>{
    const { username,password } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    
        if (rows.length === 0) {
          // req.flash("error", "Invalid email or password");
          return res.render("login", { message: "Invalid email or password !" });
        }
        const user = rows[0];
        console.log(user);
        const isMatch = password == user.password;
    
        if (!isMatch) {
          // req.flash("error", "Invalid email or password");
          return res.render("login", { message: "Invalid email or password !" });
        }
    
        // Store user in session
        // req.session.user = user;
        req.session.user = { id: user.email, username: user.username };

        res.redirect('/');
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
});

router.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

// Render "register.ejs" when visiting "/register"
router.get("/register", (req, res) => {
  res.render("register", { message: "" });
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


router.get("/session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ message: "Authenticated", user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render('login');
  });
});


export default router;
