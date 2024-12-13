"use client";
import "tailwindcss/tailwind.css";
import "../../styles/globals.css";
import CreateEntry from "./components/CreateEntry";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div>
        <CreateEntry />
      </div>
    </div>
  );
}
