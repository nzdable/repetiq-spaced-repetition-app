"use client";
import React from "react";
import db from "../../utils/firestore";
import { doc, deleteDoc } from "@firebase/firestore";
import "tailwindcss/tailwind.css";
import "../../../styles/globals.css";

const DeleteEntry = ({ id, setEntries }) => {
  // Handle delete operation for a specific entry
  const handleDelete = async (id) => {
    const entryRef = doc(db, "entries", id);
    try {
      await deleteDoc(entryRef); // Deletes the entry with the given ID
      alert("Entry deleted successfully");
      // Update the state by filtering out the deleted entry
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
        onClick={() => handleDelete(id)} // Delete the entry by its ID
        className="bg-black text-white px-4 py-2 rounded hover:bg-black"
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteEntry;
