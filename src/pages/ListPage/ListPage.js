import React, { useEffect, useState } from "react";
import api from "../../apiConfig";
import Modal from "react-modal";
import './ListPage.css';

// Обязательная настройка root для модального окна
Modal.setAppElement('#root');

function ListPage() {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null); // Состояние для выбранной книги
    const [fileType, setFileType] = useState('pdf'); // Состояние для выбора типа файла
    const [modalIsOpen, setModalIsOpen] = useState(false); // Состояние для модального окна книги
    const [addModalIsOpen, setAddModalIsOpen] = useState(false); // Состояние для модального окна добавления книги
    const [newBook, setNewBook] = useState({ title: '', author: '', coverImageUrl: '' }); // Состояние для новой книги

    useEffect(() => {
        fetchBooks()
    }, []);

    const fetchBooks = () => {
        api.get('/books')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error))
    }

    const openModal = (book) => {
        setSelectedBook(book);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedBook(null);
        setModalIsOpen(false);
    };

    const deleteBook = () => {
        if (selectedBook) {
            api.delete(`/books/${selectedBook.id}`)
                .then(() => {
                    console.log(`Book with ID ${selectedBook.id} deleted successfully.`);
                    fetchBooks();
                    closeModal();
                })
                .catch(error => console.error('Error deleting book:', error));
        }
    };

    const downloadBook = () => {
        if (selectedBook && fileType) {
            const downloadUrl = `${api.getUri()}/books/download/${selectedBook.id}?fileType=${fileType}`;
            window.open(downloadUrl, '_blank');
        }
    };

    const handleAddBookClick = () => {
        setAddModalIsOpen(true); // Открытие модалки добавления новой книги
    };

    const closeAddModal = () => {
        setAddModalIsOpen(false);
        setNewBook({ title: '', author: '', coverImageUrl: '' });
    };

    const handleNewBookChange = (e) => {
        setNewBook({ ...newBook, [e.target.name]: e.target.value });
    };

    const handleNewBookSubmit = () => {
        api.post('/books', newBook)
            .then(() => {
                fetchBooks();
                closeAddModal();
            })
            .catch(error => console.error('Error adding book:', error));
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen relative"> {/* Добавляем relative для родительского контейнера */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {books.map(book => (
                    <div key={book.id} className="flex flex-col items-center">
                        {book['coverImageUrl'] ? (
                            <img
                                src={book['coverImageUrl']}
                                alt={book.title}
                                className="h-48 w-32 object-cover mb-2 rounded shadow-md book-card"
                                onClick={() => openModal(book)} // Открытие модалки при клике
                            />
                        ) : (
                            <div
                                className="h-48 w-32 bg-gray-200 mb-2 flex items-center justify-center rounded shadow-md book-card"
                                onClick={() => openModal(book)} // Открытие модалки при клике
                            >
                                <span className="text-gray-500 text-sm">No Image</span>
                            </div>
                        )}
                        <h2 className="font-medium text-sm text-center">{book.title}</h2>
                        <p className="text-gray-500 text-xs text-center">{book.author}</p>
                    </div>
                ))}
            </div>

            {/* Кнопка добавления новой книги */}
            <button
                onClick={handleAddBookClick}
                className="absolute bottom-5 right-5 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-green-600 transition"
            >
                <span className="text-2xl" style={{ marginBottom: '2px' }}>+</span>
            </button>

            {/* Модальное окно для добавления новой книги */}
            <Modal
                isOpen={addModalIsOpen}
                onRequestClose={closeAddModal}
                contentLabel="Add New Book"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="modal-content">
                    <h2 className="text-lg font-bold mb-4">Добавить новую книгу</h2>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-600 mb-1">Название книги</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newBook.title}
                            onChange={handleNewBookChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="coverImageUrl" className="block text-gray-600 mb-1">URL обложки</label>
                        <input
                            type="text"
                            id="coverImageUrl"
                            name="coverImageUrl"
                            value={newBook.coverImageUrl}
                            onChange={handleNewBookChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleNewBookSubmit}>
                            Добавить книгу
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Модальное окно для просмотра книги */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Book Details"
                className="modal"
                overlayClassName="modal-overlay"
            >
                {selectedBook && (
                    <div className="modal-content">
                        <h2 className="text-lg font-bold mb-2">{selectedBook.title}</h2>
                        <p className="text-sm text-gray-600 mb-4">{selectedBook.author}</p>
                        {selectedBook.coverImageUrl && (
                            <img
                                src={selectedBook.coverImageUrl}
                                alt={selectedBook.title}
                                className="h-60 w-40 object-cover mb-4 rounded shadow-md"
                            />
                        )}
                        {/* Добавляем выбор типа файла */}
                        <div className="mb-4">
                            <label htmlFor="fileType" className="block text-gray-600 mb-1">Выберите тип файла:</label>
                            <select
                                id="fileType"
                                value={fileType}
                                onChange={(e) => setFileType(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="pdf">PDF</option>
                                <option value="epub">EPUB</option>
                                <option value="mobi">MOBI</option>
                            </select>
                        </div>
                        <div className="flex justify-between">
                            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={downloadBook}>Загрузить</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={deleteBook}>Удалить</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ListPage;
