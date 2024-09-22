import React, {useEffect, useState} from "react";
import api from "../../apiConfig";

function ListPage() {
    const [books, setBooks] = useState([])

    useEffect(() => {
        api.get('/books')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error))
    }, []);

    return (
        <ul>
            { books.map(book => (
                <li key={book.id}>{book.title}</li>
            )) }
        </ul>
    )
}

export default ListPage