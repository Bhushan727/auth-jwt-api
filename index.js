const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors")

const app = express();
app.use(cors());
app.use(express.json());

const secretKey = "secret";
const users = [];

app.get('/',(req,res) => {
    console.log("home route");
    res.send("Welcome to home Route");
})

// Create a new user
app.post("/api/users", (req, res) => {
  const user = req.body;
  users.push(user);
  res.json({ message: "User created successfully." });
});

// Read all users
app.get("/api/users", (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token." });
    } else {
      res.json(users);
    }
  });
});

// Update a user
app.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;
  users[id] = user;
  res.json({ message: "User updated successfully." });
});

// Delete a user
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  users.splice(id, 1);
  res.json({ message: "User deleted successfully." });
});

// Login
app.post("/api/login", (req, res) => {
  const user = req.body;
  if (user.username === "admin" && user.password === "password") {
    const token = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful.", token });
  } else {
    res.status(401).json({ message: "Login failed." });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port 5000`);
});
