"use client";
import React, { useState, useEffect } from "react";
import db from "../../utils/firestore";
import { doc, updateDoc } from "@firebase/firestore"; // Import updateDoc to update the entry
import "tailwindcss/tailwind.css";
import "../../../styles/globals.css";

function EditEntry({ entry, updateEntry, cancelEdit }) {
  const [topic, setTopic] = useState(entry.topic);
  const [description, setDescription] = useState(entry.description);
  const [activeRecallDate, setActiveRecallDate] = useState(
    entry.activeRecallDate || ""
  );
  const [testDate, setTestDate] = useState(entry.testDate || "");
  const [reps, setReps] = useState(entry.reps || "");

  useEffect(() => {
    const formatDate = (date) => {
      if (!date) return "";
      const newDate = new Date(date);
      return newDate.toISOString().split("T")[0]; // Converts to YYYY-MM-DD format
    };

    setTopic(entry.topic);
    setDescription(entry.description);
    setActiveRecallDate(formatDate(entry.activeRecallDate)); // Ensure correct date format
    setTestDate(formatDate(entry.testDate)); // Ensure correct date format
    setReps(entry.reps);
  }, [entry]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a reference to the entry document
    const entryRef = doc(db, "entries", entry.id);

    try {
      // Update the entry in Firestore
      await updateDoc(entryRef, {
        topic,
        description,
        activeRecallDate,
        testDate,
        reps,
      });

      alert("Entry updated successfully");
      updateEntry({
        ...entry,
        topic,
        description,
        activeRecallDate,
        testDate,
        reps,
      });
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4">Edit Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Active Recall Date
          </label>
          <input
            type="date"
            value={activeRecallDate}
            onChange={(e) => setActiveRecallDate(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Test Date
          </label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reps
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            className="border border-black border-2 text-black px-6 py-2 rounded"
          >
            Update
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            className="border border-black border-2 text-black px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEntry;
