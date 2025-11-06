import { useState } from "react";

function Home() {
  const [filters, setFilters] = useState({
    category: "",
    department: "",
    semester: "",
  });

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [subjects, setSubjects] = useState([]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setYears(["2024", "2023", "2022", "2021"]);
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);

    // Mock subject data
    setSubjects([
      { name: "Data Structures", link: "#" },
      { name: "AI Basics", link: "#" },
      { name: "Operating Systems", link: "#" },
      { name: "DBMS", link: "#" },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">🎓 LastNight PYQs Finder</h1>

      {/* Filter Form */}
      {!selectedYear && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-md w-80 flex flex-col space-y-4">
          <select name="category" onChange={handleChange} className="p-2 rounded bg-gray-700">
            <option value="">Select Category</option>
            <option value="pyq">PYQs</option>
            <option value="notes">Notes</option>
            <option value="others">Others</option>
          </select>

          <input
            name="department"
            onChange={handleChange}
            placeholder="Department (e.g. AI, CS)"
            className="p-2 rounded bg-gray-700"
          />
          <input
            name="semester"
            onChange={handleChange}
            placeholder="Semester (e.g. 1, 2, 3...)"
            className="p-2 rounded bg-gray-700"
          />

          <button type="submit" className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold">
            Search
          </button>
        </form>
      )}

      {/* Year Selection */}
      {!selectedYear && years.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4">
          {years.map((year) => (
            <div
              key={year}
              onClick={() => handleYearClick(year)}
              className="bg-gray-800 p-4 rounded-xl shadow hover:scale-105 transition-transform cursor-pointer"
            >
              <h2 className="text-xl font-semibold">{year}</h2>
              <p className="text-sm text-gray-400">Click to view subjects</p>
            </div>
          ))}
        </div>
      )}

      {/* Subject Table */}
      {selectedYear && (
        <div className="bg-gray-800 mt-8 p-6 rounded-xl w-[90%] max-w-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">
            📘 {selectedYear} Subjects
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2">Subject</th>
                <th className="py-2 text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-2">{sub.name}</td>
                  <td className="py-2 text-right">
                    <a
                      href={sub.link}
                      className="text-blue-400 hover:text-blue-300 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={() => setSelectedYear("")}
            className="mt-6 bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold w-full"
          >
            ← Back to Years
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
