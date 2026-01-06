const mongoose = require("mongoose");
const Book = require("./book");

mongoose.connect("mongodb://127.0.0.1:27017/libraryDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* ---------------- CREATE ---------------- */

// Insert minimum 7 books
async function insertBooks() {
  await Book.insertMany([
    { title: "Clean Code", author: "Robert Martin", category: "Programming", publishedYear: 2014, availableCopies: 5 },
    { title: "Atomic Habits", author: "James Clear", category: "Self-Help", publishedYear: 2018, availableCopies: 4 },
    { title: "Deep Work", author: "Cal Newport", category: "Productivity", publishedYear: 2016, availableCopies: 3 },
    { title: "AI Basics", author: "Tom Taulli", category: "Technology", publishedYear: 2020, availableCopies: 6 },
    { title: "Python Crash Course", author: "Eric Matthes", category: "Programming", publishedYear: 2019, availableCopies: 2 },
    { title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", publishedYear: 1993, availableCopies: 1 },
    { title: "Think Fast and Slow", author: "Daniel Kahneman", category: "Psychology", publishedYear: 2011, availableCopies: 3 }
  ]);
  console.log("Books inserted");
}

/* ---------------- READ ---------------- */

// All books
async function getAllBooks() {
  const books = await Book.find();
  console.log(books);
}

// Books by category
async function getBooksByCategory(category) {
  const books = await Book.find({ category });
  console.log(books);
}

// Books after year 2015
async function getBooksAfter2015() {
  const books = await Book.find({ publishedYear: { $gt: 2015 } });
  console.log(books);
}

/* ---------------- UPDATE ---------------- */

// Increase / decrease copies (with negative stock prevention)
async function updateCopies(bookId, change) {
  const book = await Book.findById(bookId);

  if (!book) {
    console.log("Error: Book not found");
    return;
  }

  if (book.availableCopies + change < 0) {
    console.log("Error: Negative stock not allowed");
    return;
  }

  book.availableCopies += change;
  await book.save();
  console.log("Copies updated");
}

// Change category
async function changeCategory(bookId, newCategory) {
  const book = await Book.findById(bookId);

  if (!book) {
    console.log("Error: Book not found");
    return;
  }

  book.category = newCategory;
  await book.save();
  console.log("Category updated");
}

/* ---------------- DELETE ---------------- */

// Remove book if copies = 0
async function deleteIfZeroCopies(bookId) {
  const book = await Book.findById(bookId);

  if (!book) {
    console.log("Error: Book not found");
    return;
  }

  if (book.availableCopies === 0) {
    await Book.findByIdAndDelete(bookId);
    console.log("Book deleted");
  } else {
    console.log("Error: Cannot delete book with available copies");
  }
}

/* ---------------- CALL FUNCTIONS ---------------- */

// Uncomment as needed
// insertBooks();
// getAllBooks();
// getBooksByCategory("Programming");
// getBooksAfter2015();
// updateCopies("BOOK_ID", -1);
// changeCategory("BOOK_ID", "Computer Science");
// deleteIfZeroCopies("BOOK_ID");

