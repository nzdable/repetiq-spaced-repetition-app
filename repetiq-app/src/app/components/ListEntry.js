"use client";
import React, { useState, useEffect } from "react";
import db from "../../utils/firestore";
import { collection, getDocs } from "@firebase/firestore";
import "tailwindcss/tailwind.css";
import "../../../styles/globals.css";
import DeleteEntry from "./DeleteEntry";
import EditEntry from "./EditEntry"; // Import the EditEntry component

const ListEntry = () => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null); // State to track the entry being edited

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "entries"));
        const fetchedEntries = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setEntries(fetchedEntries);
      } catch (error) {
        console.error("Error fetching entries: ", error);
      }
    };

    fetchEntries();
  }, []);

  const handleEdit = (entry) => {
    setEditingEntry(entry); // Set the entry to be edited
  };

  const cancelEdit = () => {
    setEditingEntry(null); // Reset editing state to null (cancel editing)
  };

  const updateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    setEditingEntry(null); // After updating, close the edit form
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">List of Entries</h1>
      <ul className="space-y-4">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <li
              key={entry.id}
              className="border p-4 rounded border-black border-2 bg-white"
            >
              <h2 className="text-lg font-semibold">Topic: {entry.topic}</h2>
              <p>Description: {entry.description}</p>
              <p>Test Date: {entry.testDate}</p>
              <p className="text-lg font-semibold">Review Schedule:</p>
              <p className="grid grid-rows gap-2">
                {entry.schedule &&
                  entry.schedule.map((scheduleItem, index) => (
                    <span key={index}>{scheduleItem}</span>
                  ))}
              </p>
              <p className="flex space-x-4">
                <DeleteEntry id={entry.id} setEntries={setEntries} />
                <button
                  onClick={() => handleEdit(entry)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-black"
                >
                  Edit
                </button>
              </p>

              {/* Conditionally render EditEntry form if we're editing this entry */}
              {editingEntry && editingEntry.id === entry.id && (
                <EditEntry
                  entry={editingEntry}
                  updateEntry={updateEntry}
                  cancelEdit={cancelEdit}
                />
              )}
            </li>
          ))
        ) : (
          <p>No entries found.</p>
        )}
      </ul>
    </div>
  );
};

export default ListEntry;
