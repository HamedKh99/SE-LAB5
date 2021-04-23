const express = require("express");
const jwt = require("jsonwebtoken");
require("./src/db/mongoose");
const User = require("./src/models/user");

const port = process.env.PROFILE_PORT || 8083;

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });

  req.token = token;
  req.user = user;
  next();
});

app.get("/user/profile", async (req, res) => {
  res.send(req.user);
});

app.put("/user/profile", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password", "mobile"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
