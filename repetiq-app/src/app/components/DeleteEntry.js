"use client";
import React from "react";
import db from "../../utils/firestore";
import { doc, deleteDoc } from "@firebase/firestore";
import "tailwindcss/tailwind.css";
import "../../../styles/globals.css";

const DeleteEntry = ({ id, setEntries }) => {
  const handleDelete = async (id) => {
    const entryRef = doc(db, "entries", id);
    try {
      await deleteDoc(entryRef); 
      alert("Entry deleted successfully");
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleDelete(id)} 
        className="bg-black text-white px-4 py-2 rounded hover:bg-black"
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteEntry;
