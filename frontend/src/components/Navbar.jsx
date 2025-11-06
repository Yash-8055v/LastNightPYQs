import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">LastNightPYQs</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/about" className="hover:text-blue-400">About</Link>
        <Link to="/login" className="hover:text-blue-400">Login</Link>
        <Link to="/admin" className="hover:text-blue-400">Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;
