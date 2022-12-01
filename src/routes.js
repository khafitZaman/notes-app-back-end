const { addBookHandler, getAllBooks, getBookById, ubahBuku, hapusBuku } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: ubahBuku
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: hapusBuku
  }
]

module.exports = routes
