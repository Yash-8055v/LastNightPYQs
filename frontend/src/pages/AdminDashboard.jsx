import { useState } from "react";

function AdminDashboard() {
  const [fileData, setFileData] = useState({
    category: "",
    department: "",
    semester: "",
    year: "",
    subject: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFileData({
      ...fileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Uploading file:", fileData, file);
    alert("File uploaded (simulation only)");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-400">🧑‍💻 Admin Upload Panel</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl shadow-md w-[90%] max-w-md flex flex-col space-y-4"
      >
        <select
          name="category"
          onChange={handleChange}
          className="p-2 rounded bg-gray-700"
          required
        >
          <option value="">Select Category</option>
          <option value="pyq">PYQs</option>
          <option value="notes">Notes</option>
        </select>

        <input
          name="department"
          placeholder="Department (e.g. AI, CS)"
          onChange={handleChange}
          className="p-2 rounded bg-gray-700"
          required
        />

        <input
          name="semester"
          placeholder="Semester"
          onChange={handleChange}
          className="p-2 rounded bg-gray-700"
          required
        />

        <input
          name="year"
          placeholder="Year (e.g. 2024)"
          onChange={handleChange}
          className="p-2 rounded bg-gray-700"
          required
        />

        <input
          name="subject"
          placeholder="Subject Name"
          onChange={handleChange}
          className="p-2 rounded bg-gray-700"
          required
        />

        <input
          type="file"
          onChange={handleFileChange}
          className="p-2 rounded bg-gray-700"
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 p-2 rounded font-semibold"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;
