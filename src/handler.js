const { nanoid } = require('nanoid')
const books = require('./books')

// Handler untuk menambah buku
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return createFailResponse(h, 'Gagal menambahkan buku. Mohon isi nama buku', 400)
  }

  if (readPage > pageCount) {
    return createFailResponse(h, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400)
  }

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  return createSuccessResponse(h, 'Buku berhasil ditambahkan', { bookId: id }, 201)
}

// Handler untuk mendapatkan semua buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let filteredBooks = books

  // Filter berdasarkan nama buku
  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  // Filter berdasarkan status membaca
  if (reading !== undefined) {
    const isReading = reading === '1'
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading)
  }

  // Filter berdasarkan status selesai
  if (finished !== undefined) {
    const isFinished = finished === '1'
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished)
  }

  const responseBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  return createSuccessResponse(h, 'Daftar buku berhasil ditemukan', { books: responseBooks }, 200)
}

// Handler untuk mendapatkan buku berdasarkan ID
const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = findBookById(id)

  if (book) {
    return createSuccessResponse(h, 'Buku berhasil ditemukan', { book }, 200)
  }

  return createFailResponse(h, 'Buku tidak ditemukan', 404)
}

// Handler untuk mengedit buku berdasarkan ID
const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const index = findBookIndexById(id)

  if (index === -1) {
    return createFailResponse(h, 'Gagal memperbarui buku. Id tidak ditemukan', 404)
  }

  if (!name) {
    return createFailResponse(h, 'Gagal memperbarui buku. Mohon isi nama buku', 400)
  }

  if (readPage > pageCount) {
    return createFailResponse(h, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400)
  }

  const finished = pageCount === readPage
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt
  }

  return createSuccessResponse(h, 'Buku berhasil diperbarui', null, 200)
}

// Handler untuk menghapus buku berdasarkan ID
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params
  const index = findBookIndexById(id)

  if (index === -1) {
    return createFailResponse(h, 'Buku gagal dihapus. Id tidak ditemukan', 404)
  }

  books.splice(index, 1)

  return createSuccessResponse(h, 'Buku berhasil dihapus', null, 200)
}

// Fungsi untuk mencari buku berdasarkan ID
const findBookById = (id) => books.find((book) => book.id === id)

// Fungsi untuk mencari indeks buku berdasarkan ID
const findBookIndexById = (id) => books.findIndex((book) => book.id === id)

// Fungsi untuk membuat respons sukses
const createSuccessResponse = (h, message, data = null, statusCode = 200) =>
  h
    .response({
      status: 'success',
      message,
      data
    })
    .code(statusCode)

// Fungsi untuk membuat respons gagal
const createFailResponse = (h, message, statusCode = 500) =>
  h
    .response({
      status: 'fail',
      message
    })
    .code(statusCode)

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
