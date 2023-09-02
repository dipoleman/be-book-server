const fs = require('fs/promises');

function greeter(response) {
  response.write(JSON.stringify('Hello!'));
  response.statusCode = 200;
  response.end();
}

function allBooks(response) {
  fs.readFile(`${__dirname}/data/books.json`)
    .then((result) => {
      response.write(result.toString());
      response.statusCode = 200;
      response.end();
    })
    .catch((err) => {
      response.write(JSON.stringify({ message: 'File not found' }));
      response.statusCode = 404;
      response.end();
    });
}

function allAuthors(response) {
  fs.readFile(`${__dirname}/data/authors.json`)
    .then((result) => {
      response.write(result.toString());
      response.statusCode = 200;
      response.end();
    })
    .catch((err) => {
      response.write(JSON.stringify({ message: 'File not found' }));
      response.statusCode = 404;
      response.end();
    });
}

function specificBook(request, response) {
  const { url } = request;
  const id = Number(url.split('books/')[1]);
  fs.readFile(`${__dirname}/data/books.json`)
    .then((result) => {
      const book = JSON.parse(result).filter((obj) => {
        return obj.bookId === id;
      });
      response.write(JSON.stringify(book));
      response.statusCode = 200;
      response.end();
    })
    .catch((err) => {
      response.write(JSON.stringify({ message: 'Book not found' }));
      response.statusCode = 404;
      response.end();
    });
}

function authorOfBook(request, response) {
  const { url } = request;
  const id = Number(url.split('books/')[1].split('/author')[0]);
  fs.readFile(`${__dirname}/data/books.json`)
    .then((result) => {
      const book = JSON.parse(result).filter((obj) => {
        return obj.bookId === id;
      });
      const authorId = book[0].authorId;

      fs.readFile(`${__dirname}/data/authors.json`)
        .then((res) => {
          const author = JSON.parse(res).filter((obj) => {
            return obj.authorId === authorId;
          })[0];

          response.write(JSON.stringify(author));
          response.statusCode = 200;
          response.end();
        })
        .catch((err) => {
          response.write(JSON.stringify({ message: 'Author not found' }));
          response.statusCode = 404;
          response.end();
        });
    })
    .catch((err) => {
      response.write(JSON.stringify({ message: 'Book not found' }));
      response.statusCode = 404;
      response.end();
    });
}

function fictionBookGetter(response) {
  fs.readFile(`${__dirname}/data/books.json`)
    .then((result) => {
      const fictionBooks = JSON.parse(result).filter((book) => {
        return book.isFiction;
      });

      response.write(JSON.stringify(fictionBooks));
      response.statusCode = 200;
      response.end();
    })
    .catch((err) => {
      response.write(JSON.stringify({ message: 'Fiction books not found!' }));
      response.statusCode = 404;
      response.end();
    });
}

function nonFictionBookGetter(response) {
  fs.readFile(`${__dirname}/data/books.json`)
    .then((result) => {
      const nonFictionBooks = JSON.parse(result).filter((book) => {
        return !book.isFiction;
      });

      response.write(JSON.stringify(nonFictionBooks));
      response.statusCode = 200;
      response.end();
    })
    .catch((err) => {
      response.write(
        JSON.stringify({ message: 'Non Fiction books not found!' })
      );
      response.statusCode = 404;
      response.end();
    });
}

function badFictionRequest(response) {
  response.write(
    JSON.stringify({
      message:
        'You made a bad request! fiction can be only either true or false',
    })
  );
  response.statusCode = 400;
  response.end();
}

function bookPoster(request, response) {
  fs.readFile(`${__dirname}/data/books.json`).then((result) => {
    let body = '';
    request.on('data', (packet) => {
      body += packet.toString();
    });
    request.on('end', () => {
      let maxId = 0;
      const newBook = JSON.parse(body);
      const keys = Object.keys(newBook);

      if (
        keys.includes('bookTitle') &&
        keys.includes('authorId') &&
        keys.includes('isFiction')
      ) {
        const books = JSON.parse(result.toString());
        books.forEach((book) => {
          if (book.bookId > maxId) {
            maxId = book.bookId;
          }
        });

        newBook.bookId = ++maxId;

        books.push(newBook);

        fs.writeFile(
          `${__dirname}/data/books.json`,
          JSON.stringify(books, null, 2)
        )
          .then(() => {
            response.write(JSON.stringify(newBook));
            response.statusCode = 201;
            response.end();
          })
          .catch((err) => {
            response.write(
              JSON.stringify({ message: 'Unable to write your book to file' })
            );
            response.statusCode = 404;
            response.end();
          });
      } else {
        response.write(
          JSON.stringify({
            message: 'Post request object provided in wrong format!',
          })
        );
        response.statusCode = 400;
        response.end();
      }
    });
  });
}

module.exports = {
  greeter,
  allBooks,
  allAuthors,
  specificBook,
  authorOfBook,
  fictionBookGetter,
  nonFictionBookGetter,
  badFictionRequest,
  bookPoster,
};
