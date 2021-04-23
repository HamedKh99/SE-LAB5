const express = require("express");
require("./src/db/mongoose");
const Book = require("./src/models/book");

const port = process.env.BOOK_PORT || 8084;

const app = express();

app.use(express.json());

app.post("/book", async (req, res) => {
  const book = new Book(req.body);
  try {
    await book.save();
    res.status(201).send({ book });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.put("/book/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) res.status(404).send();

  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "category", "author", "price"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (book[update] = req.body[update]));
    await book.save();
    res.send(book);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/book/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) res.status(404).send();
  res.send(book);
});

app.get("/book", async (req, res) => {
  const books = await Book.find({})
  res.send({books});
});

app.delete("/book/:id", async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) res.status(404).send();
  res.send(book);
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
