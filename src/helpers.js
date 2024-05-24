const createSuccessResponse = (h, message, data = null, statusCode = 200) =>
  h
    .response({
      status: 'success',
      message,
      data
    })
    .code(statusCode)

const createFailResponse = (h, message, statusCode = 400) =>
  h
    .response({
      status: 'fail',
      message
    })
    .code(statusCode)

const findBookById = (books, id) => books.find((book) => book.id === id)

const findBookIndexById = (books, id) => books.findIndex((book) => book.id === id)

module.exports = {
  createSuccessResponse,
  createFailResponse,
  findBookById,
  findBookIndexById
}
