const {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  updateDetailBookHandler,
  deleleBookHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBookHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateDetailBookHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleleBookHandler,
  },
];

module.exports = routes;
