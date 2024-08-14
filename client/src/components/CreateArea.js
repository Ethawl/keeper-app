import React, { useState } from "react";
import { useCookies } from "react-cookie";

function CreateArea({ getData }) {
  const [cookies, useCookie, removeCookie] = useCookies(null);

  const [notes, setNotes] = useState({
    title: "",
    content: "",
    users_id: cookies.userId
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNotes(data => ({
      ...data,
      [name]: value
    }));
  }

  async function postData(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notes)
      });
      if (response.ok) {
        setNotes({ title: "", content: "", users_id: 1 });
        console.log(getData());
        getData();

      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="create-area">
      <form>
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={notes.title}
        />
        <textarea
          name="content"
          placeholder="Take a note..."
          rows="3"
          onChange={handleChange}
          value={notes.content}
        />
        <button className="add-btn" onClick={postData}>Add</button>
      </form>
    </div>
  );
}


export default CreateArea;
