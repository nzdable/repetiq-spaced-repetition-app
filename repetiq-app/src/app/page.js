"use client";
import "tailwindcss/tailwind.css";
import "../../styles/globals.css";
import CreateEntry from "./components/CreateEntry";
import ListEntry from "./components/ListEntry";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div>
        <CreateEntry />
        <ListEntry />
      </div>
    </div>
  );
}
