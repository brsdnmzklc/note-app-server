const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/notesDB").then(() => {
  console.log("Connected to notesDB");
});
const categorySchema = mongoose.Schema({
  name: String,
  image_url: String,
});

const noteSchema = mongoose.Schema({
  title: String,
  note: String,
  category: String,
  create_at: Date,
  update_at: Date,
});

const Note = mongoose.model("Note", noteSchema);
const Category = mongoose.model("Category", categorySchema);
// NOTES

app.get("/getAllNotes", (req, res) => {
  Note.find({}).then((notes) => res.send(notes));
});

app.get("/getNote", (req, res) => {
  const id = req.query.id;
  Note.findById({ _id: id }).then((note) => res.send(note));
});
app.get("/getNotesByCategory", (req, res) => {
  const category = req.query.category;
  Note.find({ category: category }).then((notes) => res.send(notes));
});
app.post("/insertNote", (req, res) => {
  const { title, note, category, create_at } = req.body.params;

  const newNote = new Note({
    title,
    note,
    category,
    create_at,
  });

  newNote.save();
  res.send(newNote);
});
app.post("/updateNote", (req, res) => {
  const { id, title, note, category, create_at, update_at } = req.body.params;
  const updatedNote = {
    title,
    note,
    category,
    create_at,
    update_at,
  };
  Note.findByIdAndUpdate({ _id: id }, { ...updatedNote }).then(() =>
    Note.findById({ _id: id }).then((notes) => res.send(notes))
  );
});
app.post("/deleteNote", (req, res) => {
  const id = req.body.params.id;
  Note.findByIdAndDelete({ _id: id }).then(() => res.send("Note deleted"));
  console.log(id);
});

//CATEGORIES

app.get("/getAllCategories", (req, res) => {
  Category.find({}).then((categories) => res.send(categories));
});
app.post("/insertCategory", (req, res) => {
  const { name, image_url } = req.body.params;

  const newCategory = Category({
    name,
    image_url,
  });
  newCategory.save();
  res.send(newCategory);
});
app.post("/updateCategory", (req, res) => {
  const { id, name, image_url } = req.query;
  Category.findByIdAndUpdate(
    { _id: id },
    { name: name, image_url: image_url }
  ).then(() => res.send("Category updated."));
});
app.post("/deleteCategory", (req, res) => {
  const { id } = req.body.params;
  console.log(id);
  Category.findByIdAndDelete({ _id: id }).then(() =>
    res.send("Category deleted")
  );
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
