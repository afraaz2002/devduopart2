import express from "express";
import db from "../config/db.js";


const router = express.Router();

// ✅ Middleware to check session
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized! Please log in." });
  }
  next();
};

// ✅ Add new post
router.post("/addpost", isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user.id;

  try {
    await db.query("INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)", [
      title,
      content,
      userId,
    ]);
    res.json({ message: "Post added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add post" });
  }
});

// ✅ Edit post
router.put("/edit/:id", isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const postId = req.params.id;
  const userId = req.session.user.id;

  try {
    const [post] = await db.query("SELECT * FROM posts WHERE id = ? AND user_id = ?", [
      postId,
      userId,
    ]);

    if (post.length === 0) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    await db.query("UPDATE posts SET title = ?, content = ? WHERE id = ?", [
      title,
      content,
      postId,
    ]);
    res.json({ message: "Post updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post" });
  }
});

// ✅ Delete post
router.delete("/delete/:id", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user.id;

  try {
    const [post] = await db.query("SELECT * FROM posts WHERE id = ? AND user_id = ?", [
      postId,
      userId,
    ]);

    if (post.length === 0) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await db.query("DELETE FROM posts WHERE id = ?", [postId]);
    res.json({ message: "Post deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

export default router;