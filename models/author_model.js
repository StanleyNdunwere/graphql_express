
const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const authorSchema = new Schema({
  name: { type: String },
  age: { type: Number },
})

const Author = mongoose.model('author', authorSchema);
module.exports = {
  Author
}