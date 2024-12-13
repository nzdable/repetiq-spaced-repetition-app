"use client";
import React, { useState, useEffect } from "react";
import db from "../../utils/firestore";
import { collection, getDocs } from "@firebase/firestore";
import "tailwindcss/tailwind.css";
import "../../../styles/globals.css";

const ListEntry = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntry = async () => {
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

    fetchEntry();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">List of Entries</h1>
      <ul className="space-y-4">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <li
              key={entry.id}
              className="border p-4 rounded border border-black border-2 bg-white"
            >
              <h2 className="text-lg font-semibold">Topic: {entry.topic}</h2>
              <p>Description: {entry.description}</p>
              <p>Test Date: {entry.testDate}</p>
              <p className="text-lg font-semibold">Review Schedule:</p>
              <p className="grid grid-rows gap-2">
                {entry.schedule &&
                  entry.schedule.map((item, index) => (
                    <span key={index}>{item}</span>
                  ))}
              </p>
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

// function ListEntry({ entries, deleteEntry, editEntry }) {
//   return (
//     <div>
//       <h2>Entries List</h2>
//       <ul>
//         {entries.map((entry) => (
//           <li key={entry.id}>
//             <p>
//               <strong>Topic:</strong> {entry.topic}
//             </p>
//             <p>
//               <strong>Description:</strong> {entry.description}
//             </p>
//             <p>
//               <strong>Active Recall Date:</strong> {entry.activeRecallDate}
//             </p>
//             <p>
//               <strong>Test Date:</strong> {entry.testDate}
//             </p>
//             <p>
//               <strong>Repetitions:</strong> {entry.reps}
//             </p>
//             <p>
//               <strong>Schedule:</strong> {entry.schedule}
//             </p>

//             <button onClick={() => editEntry(entry)}>Edit</button>
//             <button onClick={() => deleteEntry(entry.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default EntryList;
