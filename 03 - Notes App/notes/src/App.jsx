import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [noteColor, setNoteColor] = useState("#ffffff"); // Default color
  const [noteFont, setNoteFont] = useState("sans-serif"); // Default font

  // Load notes from localStorage on page load
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    if (storedNotes.length > 0) {
      setNotes(storedNotes);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    if (note.trim() === "") return;

    let updatedNotes = [...notes];

    if (editIndex !== null) {
      updatedNotes[editIndex] = { text: note, color: noteColor, font: noteFont };
      setEditIndex(null);
    } else {
      updatedNotes.push({ text: note, color: noteColor, font: noteFont });
    }

    setNotes(updatedNotes);
    setNote("");
    setNoteColor("#ffffff");
    setNoteFont("sans-serif");
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  };

  const editNote = (index) => {
    setNote(notes[index].text);
    setNoteColor(notes[index].color);
    setNoteFont(notes[index].font);
    setEditIndex(index);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">📝 Notes Keeping App</h1>

      {/* Search Bar */}
      <div className="flex items-center justify-center mb-4">
        <input
          type="search"
          placeholder="Search notes..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      {/* Note Customization Options */}
      <div className="flex justify-center items-center mb-4 space-x-4">
        {/* Color Picker */}
        <input
          type="color"
          value={noteColor}
          onChange={(e) => setNoteColor(e.target.value)}
          className="w-10 h-10 border cursor-pointer"
        />

        {/* Font Selection */}
        <select
          onChange={(e) => setNoteFont(e.target.value)}
          value={noteFont}
          className="border p-2 rounded"
        >
          <option value="sans-serif">Sans</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
          <option value="fantasy">Fantasy</option>
        </select>
      </div>

      {/* Add Note */}
      <div className="flex justify-center items-center mb-4">
        <input
          type="text"
          placeholder="Enter note..."
          className="border p-2 rounded w-64"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={addNote} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded flex items-center">
          {editIndex !== null ? <FaEdit /> : <FaPlus />}
        </button>
      </div>

      {/* Notes Display */}
      <div className="max-w-md mx-auto">
        {notes
          .filter((n) => n.text.toLowerCase().includes(search.toLowerCase()))
          .map((n, index) => (
            <div
              key={index}
              className="p-3 rounded shadow mb-2 flex justify-between"
              style={{ backgroundColor: n.color, fontFamily: n.font }}
            >
              <span>{n.text}</span>
              <div>
                <button onClick={() => editNote(index)} className="text-yellow-500 mr-2">
                  <FaEdit />
                </button>
                <button onClick={() => deleteNote(index)} className="text-red-500">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
