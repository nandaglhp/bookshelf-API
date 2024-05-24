const { nanoid } = require('nanoid')
const books = require('./books')
const { createSuccessResponse, createFailResponse, findBookById, findBookIndexById } = require('./helpers')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return createFailResponse(h, 'Gagal menambahkan buku. Mohon isi nama buku')
  }

  if (readPage > pageCount) {
    return createFailResponse(h, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount')
  }

  const id = nanoid(16)
  const timestamp = new Date().toISOString()
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt: timestamp,
    updatedAt: timestamp
  }

  books.push(newBook)

  return createSuccessResponse(h, 'Buku berhasil ditambahkan', { bookId: id }, 201)
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let filteredBooks = books

  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading !== undefined) {
    const isReading = reading === '1'
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading)
  }

  if (finished !== undefined) {
    const isFinished = finished === '1'
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished)
  }

  const responseBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  return createSuccessResponse(h, 'Daftar buku berhasil ditemukan', { books: responseBooks })
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = findBookById(books, id)

  if (book) {
    return createSuccessResponse(h, 'Buku berhasil ditemukan', { book })
  }

  return createFailResponse(h, 'Buku tidak ditemukan', 404)
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return createFailResponse(h, 'Gagal memperbarui buku. Mohon isi nama buku')
  }

  if (readPage > pageCount) {
    return createFailResponse(h, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount')
  }

  const index = findBookIndexById(books, id)
  if (index === -1) {
    return createFailResponse(h, 'Gagal memperbarui buku. Id tidak ditemukan', 404)
  }

  const updatedAt = new Date().toISOString()
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    updatedAt
  }

  return createSuccessResponse(h, 'Buku berhasil diperbarui')
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params
  const index = findBookIndexById(books, id)

  if (index === -1) {
    return createFailResponse(h, 'Buku gagal dihapus. Id tidak ditemukan', 404)
  }

  books.splice(index, 1)

  return createSuccessResponse(h, 'Buku berhasil dihapus')
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
