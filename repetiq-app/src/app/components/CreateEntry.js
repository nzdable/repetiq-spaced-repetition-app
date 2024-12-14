"use client";
import React, { useState, useEffect } from "react";
import db from "../../utils/firestore";
import { collection, addDoc } from "@firebase/firestore";
import "tailwindcss/tailwind.css";
import "../../../styles/globals.css";

function CreateEntry({ addEntry }) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [activeRecallDate, setActiveRecallDate] = useState("");
  const [activeRecallTime, setActiveRecallTime] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testTime, setTestTime] = useState("");
  const [levelOfDifficulty, setLevelOfDifficulty] = useState("");
  const [reps, setReps] = useState("");
  const [schedule, setSchedule] = useState([]);

  // AUTOMATICALLY ADDING THE AR DATE AND TIME
  useEffect(() => {
    const now = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0];
    const formatTime = (date) =>
      date.toTimeString().split(":").slice(0, 2).join(":");

    setActiveRecallDate(formatDate(now));
    setActiveRecallTime(formatTime(now));
  }, []);

  // CALCULATING REVIEW SCHEDULE
  const calculateSchedule = () => {
    if (!activeRecallDate || !testDate || reps <= 0) return [];

    const startTime = activeRecallTime || "00:00";
    const endTime = testTime || "00:00";

    try {
      const start = new Date(`${activeRecallDate}T${startTime}`);
      const end = new Date(`${testDate}T${endTime}`);
      const totalDurationMs = end - start;

      if (totalDurationMs <= 0) {
        alert(
          "Test date and time must be later than Active Recall date and time."
        );
        return [];
      }

      const reviewDates = [];

      const formatTimeTo12hr = (date) => {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      if (totalDurationMs < 24 * 60 * 60 * 1000) {
        const intervals = totalDurationMs / (reps - 1);
        for (let i = 0; i < reps; i++) {
          const nextDate = new Date(start.getTime() + i * intervals);
          const formattedTime = formatTimeTo12hr(nextDate);
          reviewDates.push(
            `${nextDate.toISOString().slice(0, 10)} ${formattedTime}`
          );
        }
      } else {
        const totalDurationDays = totalDurationMs / (1000 * 60 * 60 * 24);
        const intervals = totalDurationDays / (reps - 1);
        for (let i = 0; i < reps; i++) {
          const nextDate = new Date(start);
          nextDate.setDate(start.getDate() + i * intervals);
          const formattedTime = formatTimeTo12hr(nextDate);
          reviewDates.push(
            `${nextDate.toISOString().slice(0, 10)} ${formattedTime}`
          );
        }
      }

      return reviewDates;
    } catch (error) {
      console.error("Error calculating schedule:", error);
      alert("Invalid date or time format. Please check your inputs.");
      return [];
    }
  };

  // HANDLING SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate the review schedule
    const newSchedule = calculateSchedule();

    // Create the entry object
    const entry = {
      topic,
      description,
      activeRecallDate: `${activeRecallDate} ${activeRecallTime}`,
      testDate: `${testDate} ${testTime}`,
      reps,
      schedule: newSchedule,
      levelOfDifficulty,
      createdAt: new Date(), // Optional: to keep track of the submission time
    };

    try {
      // Add to Firestore
      const docRef = await addDoc(collection(db, "entries"), entry);

      // Call addEntry prop function (if needed)

      // Reset form
      setTopic("");
      setDescription("");
      setActiveRecallDate("");
      setActiveRecallTime("");
      setTestDate("");
      setTestTime("");
      setReps("");
      setLevelOfDifficulty("");
      setSchedule(newSchedule);

      alert("Entry successfully added!");
      console.log(docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add the entry. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">
        Create New Entry
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg space-y-6 border border-black border-2"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700" htmlFor="topic">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700" htmlFor="activeRecallDate">
                AR Date
              </label>
              <input
                type="date"
                id="activeRecallDate"
                value={activeRecallDate}
                onChange={(e) => setActiveRecallDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700" htmlFor="activeRecallTime">
                AR Time
              </label>
              <input
                type="time"
                id="activeRecallTime"
                value={activeRecallTime}
                onChange={(e) => setActiveRecallTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Test Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700" htmlFor="testDate">
                Test Date
              </label>
              <input
                type="date"
                id="testDate"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700" htmlFor="testTime">
                Test Time
              </label>
              <input
                type="time"
                id="testTime"
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700" htmlFor="reps">
              Desired # of Reps
            </label>
            <input
              type="number"
              id="reps"
              value={reps}
              min="1"
              onChange={(e) => setReps(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700" htmlFor="levelOfDifficulty">
              Level of Difficulty
            </label>
            <select
              id="levelOfDifficulty"
              value={levelOfDifficulty}
              onChange={(e) => setLevelOfDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-black text-white font-semibold rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateEntry;
