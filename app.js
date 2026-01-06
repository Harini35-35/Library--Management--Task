const express = require("express");
const mongoose = require("mongoose");
const Book = require("./book");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/libraryDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* ---------------- CREATE ---------------- */
// Insert book
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).send(book);
  } catch (err) {
    res.status(400).send("Invalid book data");
  }
});

/* ---------------- READ ---------------- */
// All books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

// Books by category
app.get("/books/category/:category", async (req, res) => {
  const books = await Book.find({ category: req.params.category });
  res.send(books);
});

// Books after 2015
app.get("/books/after/2015", async (req, res) => {
  const books = await Book.find({ publishedYear: { $gt: 2015 } });
  res.send(books);
});

/* ---------------- UPDATE ---------------- */
// Increase / decrease copies
app.put("/books/:id/copies", async (req, res) => {
  const { change } = req.body;
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).send("Book not found");
  if (book.availableCopies + change < 0)
    return res.status(400).send("Negative stock not allowed");

  book.availableCopies += change;
  await book.save();
  res.send(book);
});

// Change category
app.put("/books/:id/category", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book not found");

  book.category = req.body.category;
  await book.save();
  res.send(book);
});

/* ---------------- DELETE ---------------- */
// Delete if copies = 0
app.delete("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).send("Book not found");
  if (book.availableCopies !== 0)
    return res.status(400).send("Copies not zero");

  await Book.findByIdAndDelete(req.params.id);
  res.send("Book deleted");
});

app.listen(3000, () => console.log("Server running on port 3000"));


