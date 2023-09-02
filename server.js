const http = require('http');
const fs = require('fs/promises');
const {
  greeter,
  allBooks,
  allAuthors,
  specificBook,
  authorOfBook,
  fictionBookGetter,
  nonFictionBookGetter,
  badFictionRequest,
  bookPoster,
} = require('./functions');

const server = http.createServer((request, response) => {
  response.setHeader('content-Type', 'application/json');
  const method = request.method
  const url = request.url

  if (method === 'GET' && url === '/api') {
    greeter(response);
  } else if (method === 'GET' && url === '/api/books') {
    allBooks(response);
  } else if (method === 'GET' && url === '/api/authors') {
    allAuthors(response);
  } else if (method === 'GET' && /\/api\/books\/\d+$/g.test(url)) {
    specificBook(request, response);
  } else if (method === 'GET' && /\/api\/books\/\d+\/author/g.test(url)) {
    authorOfBook(request, response);
  } else if (method === 'GET' && url === '/api/books?fiction=true') {
    fictionBookGetter(response);
  } else if (method === 'GET' && url === '/api/books?fiction=false') {
    nonFictionBookGetter(response);
  } else if (method === 'GET' && url.includes('/api/books?fiction=')) {
    badFictionRequest(response);
  } else if (method === 'POST' && url === '/api/books') {
    bookPoster(request, response);
  }
});

server.listen(9090, (err) => {
  if (err) console.log(err);
  else console.log('Server listening on port 9090');
});
