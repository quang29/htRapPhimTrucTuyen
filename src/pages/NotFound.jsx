import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-xl mb-8">Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className="px-6 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition">Back to Home</Link>
  </div>
);

export default NotFound;