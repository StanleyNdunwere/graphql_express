
const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const bookSchema = new Schema({
  name: { type: String },
  genre: { type: String },
  authorId: { type: String },
})

const Book = mongoose.model("book", bookSchema)

module.exports = {
  Book,
}