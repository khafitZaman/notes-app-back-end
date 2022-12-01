const books = require('./books')
const { nanoid } = require('nanoid')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const finished = (pageCount === readPage)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  const namaKosong = (name === undefined)

  if (namaKosong) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  const readLebihBesar = (readPage > pageCount)
  if (readLebihBesar) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  books.push(newBook)

  const success = books.filter((book) => book.id === id).length > 0
  if (success) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooks = (request, h) => {
  if (books) {
    // menampilkan nama buku
    const { name } = request.query
    if (name !== undefined) {
      const buku = books.filter((book) => book.name.toLowerCase()
        .includes(name.toLowerCase()))

      // bila buku ada
      if (buku.length > 0) {
        const response = h.response({
          status: 'success',
          data: {
            books: buku.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
          }
        })
        response.code(200)
        return response
      }

      // bila buku tidak ada
      const response = h.response({
        status: 'success',
        data: {
          books: []
        }
      })
      response.code(200)
      return response
    }

    // menampilkan reading
    const { reading } = request.query
    if (reading !== undefined) {
      if (reading === '1') {
        const buku = books.filter((book) => book.reading === true)
        const response = h.response({
          status: 'success',
          data: {
            books: buku.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
          }
        })
        response.code(200)
        return response
      } else {
        const buku = books.filter((book) => book.reading === false)
        const response = h.response({
          status: 'success',
          data: {
            books: buku.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
          }
        })
        response.code(200)
        return response
      }
    }

    // menampilkan finished
    const { finished } = request.query
    if (finished !== undefined) {
      if (finished === '1') {
        const buku = books.filter((book) => book.finished === true)
        const response = h.response({
          status: 'success',
          data: {
            books: buku.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
          }
        })
        response.code(200)
        return response
      } else {
        const buku = books.filter((book) => book.finished === false)
        const response = h.response({
          status: 'success',
          data: {
            books: buku.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
          }
        })
        response.code(200)
        return response
      }
    }

    // menampilkan semua buku
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }

  // jika books kosong
  const response = h.response({
    status: 'success',
    data: {
      books: []
    }
  })
  response.code(200)
  return response
}

const getBookById = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((boo) => boo.id === bookId)[0]
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })

  response.code(404)
  return response
}

const ubahBuku = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const namaKosong = (name === undefined)
  if (namaKosong) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  const readLebihBesar = (readPage > pageCount)
  if (readLebihBesar) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books[index] = {
      ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

const hapusBuku = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooks, getBookById, ubahBuku, hapusBuku }
