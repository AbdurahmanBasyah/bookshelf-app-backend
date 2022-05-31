const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const id = nanoid(16);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const isPageCountValid = pageCount >= readPage;
  const isNameFilled = name !== undefined;
  const isSuccess = isPageCountValid && isNameFilled;

  if (isSuccess) {
    const finished = readPage === pageCount;
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
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    books.push(newBook);
    return response;
  } if (!isNameFilled) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (!isPageCountValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const readingStatus = parseInt(request.query.reading, 10);
  const finishedStatus = parseInt(request.query.finished, 10);
  const wordContained = request.query?.name?.toLowerCase();
  if (readingStatus === 1) {
    const filteredBooks = books.filter((el) => el.reading);
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
      },
    });
    response.code(200);
    return response;
  } if (readingStatus === 0) {
    const filteredBooks = books.filter((el) => !el.reading);
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
      },
    });
    response.code(200);
    return response;
  }

  if (finishedStatus === 1) {
    const filteredBooks = books.filter((el) => el.finished);
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
      },
    });
    response.code(200);
    return response;
  } if (finishedStatus === 0) {
    const filteredBooks = books.filter((el) => !el.finished);
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
      },
    });
    response.code(200);
    return response;
  }

  if (wordContained) {
    const filteredBooks = books.filter((el) => el.name.toLowerCase().includes(wordContained));
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher })),
    },
  });
  response.code(200);
  return response;
};

const getDetailBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((el) => el.id === bookId)[0];
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateDetailBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((el) => el.id === bookId);
  const isPageCountValid = pageCount >= readPage;
  const isNameFilled = name !== undefined;

  if (!isPageCountValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (!isNameFilled) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
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
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleleBookHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
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

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  updateDetailBookHandler,
  deleleBookHandler,
};
