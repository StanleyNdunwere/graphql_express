const { Author } = require("../models/author_model")
const { Book } = require("../models/book_model")

const graphql = require("graphql");
const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt, GraphQLList,
  GraphQLNonNull,
} = graphql;

const books = [
  { name: "Gone", genre: "action", id: "1", authorId: "1" },
  { name: "Yellow Sun", genre: "Suspense", id: "2", authorId: "2" },
  { name: "Destroyed", genre: "Thriller", id: "3", authorId: "3" },
]

console.log(Author)
const authors = [
  { name: "James Patterson", age: "44", id: "1" },
  { name: "Lennon Ajan", age: "24", id: "2" },
  { name: "Grace Sullivan", age: "37", id: "5" },
]

const BookType = new GraphQLObjectType({
  name: "book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: (parent, args) => {
        return Author.findById(parent.authorId)
      }
    },

  })
})

const AuthorType = new GraphQLObjectType({
  name: "author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent, args) => {
        return Book.find({ authorId: parent.id })
      }
    }
  })
});


//Root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // return _.find(books, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent, args) => {
        return Book.find()
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: (parent, args) => {
        return Author.find()
      }
    }
  }
});


//root mutations
const Mutations = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve: (parent, args) => {
        let newAuthor = new Author({ name: args.name, age: args.age });
        let response = newAuthor.save()
        return response;
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        let newBook = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        })
        let response = newBook.save();
        return response;
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations
});