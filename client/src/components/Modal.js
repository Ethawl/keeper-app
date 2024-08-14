import React, { useState } from "react";

function Modal({ id, title, content, users_id, setShowModal, getData }) {

    const [notes, setNotes] = useState({
        id: id,
        title: title,
        content: content,
        users_id: users_id
    });

    async function editData(event) {
        event.preventDefault()
        try {
            const response = await fetch(`http://localhost:8000/notes/${notes.id}`, {
                method: `PUT`,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notes)
            })
            if (response.ok) {
                setShowModal(false)
                getData()
            }
        } catch (error) {
            console.error(error)
        }
    }


    function handleChange(event) {
        const { name, value } = event.target;
        setNotes(data => ({
            ...data,
            [name]: value
        }));
    }

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Edit your note</h3>
                    <button onClick={() => setShowModal(false)}>X</button>

                </div>

                <form>
                    <input
                        required
                        type="text"
                        placeholder="Title"
                        value={notes.title}
                        onChange={handleChange}
                        name="title"
                        className="title"
                    />
                    <input
                        required
                        type="text"
                        placeholder="Content"
                        value={notes.content}
                        onChange={handleChange}
                        name="content"
                        className="content"
                    />
                    <input
                        className="save-button"
                        type="submit"
                        value="SAVE"
                        onClick={editData}
                    />
                </form>
            </div>
        </div>
    )
}

export default Modal;