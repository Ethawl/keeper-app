import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['authToken', 'userId']);
  const authToken = cookies.authToken;
  const userId = cookies.userId;
  const [notes, setNotes] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERRURL}/notes/${userId}`);
      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, [authToken]);

  return (
    <div>
      <Routes>
        {!authToken && (
          <>
            <Route path="/login" element={<Auth isLogin={true} />} />
            <Route path="/register" element={<Auth isLogin={false} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}


        {authToken && (
          <>
            <Route path="/" element={<Navigate to="/keeperapp" replace />} />
            <Route path="/keeperapp" element={
              <>
                <Header />
                <CreateArea getData={getData} />
                {notes.map((note) => (
                  <Note
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    content={note.content}
                    userId={note.userId}
                    getData={getData}
                  />
                ))}
                <Footer />
              </>
            } />
            <Route path="*" element={<Navigate to="/keeperapp" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
