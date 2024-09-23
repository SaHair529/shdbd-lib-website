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
    const [modalIsOpen, setModalIsOpen] = useState(false); // Состояние для модального окна

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

    // Обработчик для клика по кнопке добавления книги
    const handleAddBookClick = () => {
        console.log('Кнопка добавления книги нажата!');
        // Здесь можно добавить логику для открытия формы добавления новой книги
    };

    // Внутри вашего компонента ListPage
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
            <button className="absolute bottom-5 right-5 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-green-600 transition">
                <span className="text-2xl" style={{ marginBottom: '2px' }}>+</span> {/* Сдвигаем плюсик чуть выше */}
            </button>

            {/* Модальное окно */}
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
