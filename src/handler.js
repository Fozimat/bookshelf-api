const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const finished = (pageCount === readPage) ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const checkPage = readPage > pageCount;

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    return response.code(400);
  }

  if (checkPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return response.code(400);
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    return response.code(201);
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  return response.code(500);
};

const getAllBookHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  const book = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (name) {
    const bookByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
    const response = h.response({
      status: 'success',
      data: {
        books: bookByName,
      },
    });
    return response.code(200);
  }

  if (reading === '0') {
    const bookByRead = books.filter((book) => book.reading === false)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })); ;
    const response = h.response({
      status: 'success',
      data: {
        books: bookByRead,
      },
    });
    return response.code(200);
  }

  if (reading === '1') {
    const bookByRead = books.filter((book) => book.reading === true)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })); ;
    const response = h.response({
      status: 'success',
      data: {
        books: bookByRead,
      },
    });
    return response.code(200);
  }

  if (finished === '0') {
    const bookByFinish = books.filter((book) => book.finished === false)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })); ;
    const response = h.response({
      status: 'success',
      data: {
        books: bookByFinish,
      },
    });
    return response.code(200);
  }

  if (finished === '1') {
    const bookByFinish = books.filter((book) => book.finished === true)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })); ;
    const response = h.response({
      status: 'success',
      data: {
        books: bookByFinish,
      },
    });
    return response.code(200);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: book,
    },
  });
  return response.code(200);
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    return response.code(200);
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  return response.code(404);
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  const checkPage = readPage > pageCount;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    return response.code(400);
  }

  if (checkPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return response.code(400);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    return response.code(200);
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  return response.code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    return response.code(200);
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  return response.code(404);
};

module.exports = {addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};