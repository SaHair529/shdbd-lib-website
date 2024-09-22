import React, {useEffect, useState} from "react";
import api from "../../apiConfig";

function ListPage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        api.get('/books')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error))
    }, []);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {books.map(book => (
                    <div key={book.id} className="flex flex-col items-center">
                        {book['coverImageUrl'] ? (
                            <img src={book['coverImageUrl']} alt={book.title} className="h-48 w-32 object-cover mb-2 rounded shadow-md"/>
                        ) : (
                            <div className="h-48 w-32 bg-gray-200 mb-2 flex items-center justify-center rounded shadow-md"><span className="text-gray-500 text-sm">No Image</span></div>
                        )}
                        <h2 className="font-medium text-sm text-center">{book.title}</h2>
                        <p className="text-gray-500 text-xs text-center">{book.author}</p>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default ListPage;
