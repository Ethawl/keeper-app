import React, { useState } from "react";
import Modal from "./Modal";

function Note(props) {
  const [showModal, setShowModal] = useState(false);
  const getData = props.getData


  async function deleteNote(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/notes/${props.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        getData()
      }
    } catch (error) {
      console.error(error)
    }
  }




  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={deleteNote}>DELETE</button>
      <button onClick={() => setShowModal(true)}>EDIT</button>
      {showModal && (
        <Modal
          id={props.id}
          title={props.title}
          content={props.content}
          users_id={props.users_id}
          setShowModal={setShowModal}
          getData={props.getData}
        />
      )}
    </div>
  );
}

export default Note;
