const books = require('./books');
const { nanoid } = require('nanoid');

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount == readPage ? true : false;
  let message;

  const book = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

  if (!name) {
    message = 'Mohon isi nama buku';
  } else if (pageCount < readPage) {
    message = 'readPage tidak boleh lebih besar dari pageCount';
  } else {
    books.push(book);
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: `Gagal menambahkan buku. ${message}`,
  });
  response.code(400);
  return response;
};

const getAllBook = (request, h) => {
  const { reading, finished, name } = request.query;
  let listBook = [];

  if (reading !== undefined) {
    if (reading === '1') {
      listBook.push(...books.filter((book) => Number(book.reading) === Number(reading)));
    } else {
      listBook.push(...books.filter((book) => Number(book.reading) === Number(reading)));
    }
  } else if (finished !== undefined) {
    if (reading === '1') {
      listBook.push(...books.filter((book) => Number(book.finished) === Number(finished)));
    } else {
      listBook.push(...books.filter((book) => Number(book.finished) === Number(finished)));
    }
  } else if (name !== undefined) {
    listBook.push(...books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())));
  } else {
    listBook.push(...books);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: listBook.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });
  return response;
};

const getById = (request, h) => {
  const { bookId } = request.params;

  const book = books.find(({ id }) => id === bookId);

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: { book },
  });
  response.code(200);
  return response;
};

const editBookById = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage ? true : false;
  const message = !name ? 'Mohon isi nama buku' : pageCount < readPage ? 'readPage tidak boleh lebih besar dari pageCount' : '';
  const book = books.findIndex(({ id }) => id === bookId);

  if (book === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (!name || pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: `Gagal memperbarui buku. ${message}`,
    });
    response.code(400);
    return response;
  }

  books[book] = {
    ...books[book],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.findIndex(({ id }) => id === bookId);

  if (book !== -1) {
    books.splice(book, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addBook, getAllBook, getById, editBookById, deleteBookById };
