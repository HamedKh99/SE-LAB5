const express = require("express");
require("./src/db/mongoose");
const Book = require("./src/models/book");

const port = process.env.SEEBOOKS_PORT || 8085;

const app = express();

app.use(express.json());

app.get("/client/book/category/:category", async (req, res) => {
  const books = await Book.find({category: req.params.category});
  res.send({books});
});

app.get("/client/book/title/:title", async (req, res) => {
  const book = await Book.findOne({title: req.params.title})
  if (!book) res.status(404).send()
  res.send(book);
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
