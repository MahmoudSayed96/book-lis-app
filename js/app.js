/**
 * BOOK LIST APP
 * Javascript OOP application
 *
 * Functionality: [Add, Delete, Show]
 */

/* =====================
       == BOOK Object ==
   ======================
*/
function Book(title, author, isbn) {
    // Properites
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

/* =====================
       == UI Object ==
   ======================
*/
function UI() {}
/* =====================
       == STORAGE Object ==
   ======================
*/
const Storage = {
    // Get books
    getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    },
    // Display books
    displayBooks() {
        const books = this.getBooks();
        const ui = new UI();
        books.forEach(book => {
            ui.addBookToList(book);
        });
    },
    // Add book to local storage
    storeBook(book) {
        // Get books list from local storage
        const books = this.getBooks();
        // Add book to books array
        books.push(book);

        // Restore books
        localStorage.setItem('books', JSON.stringify(books));
    },
    // Remove book
    removeBook(isbn) {
        const books = this.getBooks();
        books.forEach((book, index) => {
            if (book.isbn == isbn) {
                // Remove book
                books.splice(index, 1);
            }
        });
        // Restore books
        localStorage.setItem('books', JSON.stringify(books));
    }
}
/* =====================
       == UI PROTOTYPES ==
   ======================
*/
// Add Book to list
UI.prototype.addBookToList = function (book) {
    // Get book list
    const bookList = document.querySelector("#book-list");
    // Create new tr
    const row = document.createElement("tr");
    // Bulid cols
    row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete-book" title='Remove book'>X</a></td>
        `;
    // Append list
    bookList.appendChild(row);
};
// Clear inputs fields
UI.prototype.clearInputFields = function () {
    document.querySelector("#book-title").value = "";
    document.querySelector("#book-author").value = "";
    document.querySelector("#book-isbn").value = "";
};
// Show alert message
UI.prototype.showMessage = function (msg, className) {
    // Create div element
    const div = document.createElement("div");
    // Add classes
    div.className = `alert alert-${className}`;
    // Append text
    div.appendChild(document.createTextNode(msg));
    // Get parent
    const bookCard = document.querySelector("#book-card");
    // Get form
    const form = document.querySelector("#book-form");
    // insert alert
    bookCard.insertBefore(div, form);

    // Remove alert after 3 sec
    setTimeout(function () {
        document.querySelector(".alert").remove();
    }, 3000);
};
// Delete book
UI.prototype.deleteBookFromList = function (target) {
    if (target.classList.contains("delete-book")) {
        target.parentElement.parentElement.remove();
    }
};
/* =====================
       == EVENTS HANDLER ==
   ======================
*/
// Load book list when window loaded
document.addEventListener('DOMContentLoaded', function () {
    Storage.displayBooks();
});
// Event listner for add new book
document.querySelector("#book-form").addEventListener("submit", function (e) {
    e.preventDefault();
    // Get form input fields
    const bookTitle = document.querySelector("#book-title").value,
        bookAuthor = document.querySelector("#book-author").value,
        bookIsbn = document.querySelector("#book-isbn").value;
    // Init Book Object
    const book = new Book(bookTitle, bookAuthor, bookIsbn);
    // Init UI Object
    const ui = new UI();
    // Validate form inputs
    if (bookTitle == "" || bookAuthor == "" || bookIsbn == "") {
        // Show message
        ui.showMessage("Invalid input data", "danger");
    } else {
        // Add book to list
        ui.addBookToList(book);
        // Add book to local storage
        Storage.storeBook(book);
        ui.showMessage("Book added successfully", "success");
        // Clear inputs
        ui.clearInputFields();
    }
});

// Event listener for delete book from list
document.querySelector("#book-list").addEventListener("click", function (e) {
    e.preventDefault();
    // Init UI Object
    const ui = new UI();
    // Delete book
    ui.deleteBookFromList(e.target);
    // Get book isbn number
    const bookIsbn = e.target.parentElement.previousElementSibling.textContent;
    // Delete book from local storage
    Storage.removeBook(bookIsbn);
    // Show alert
    ui.showMessage("Book Deleted", "success");
});