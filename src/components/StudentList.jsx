import { useState, useEffect, useMemo } from "react";
import throttle from "../utils/throttle";

export default function StudentList({
  students,
  onView,
  onDelete,
  onRegister,
  searchRef,
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [students, debouncedQuery]);

  const handleDelete = throttle((id) => onDelete(id), 600);

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>All Students</h2>
          <p className="subtitle">
            {filtered.length} of {students.length} students shown
          </p>
        </div>
        <button className="btn btn-primary" onClick={onRegister}>
          + Register Student
        </button>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          ref={searchRef}
          type="text"
          placeholder="Search by name, ID, or email... (Ctrl + K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery("")}>✕</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>{students.length === 0 ? "No students registered yet." : "No matching students found."}</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="student-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  className="clickable-row"
                  onClick={() => onView(student)}
                >
                  <td><span className="badge">{student.studentId}</span></td>
                  <td className="name-cell">{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>
                    <span className={`gender-pill ${student.gender.toLowerCase()}`}>
                      {student.gender}
                    </span>
                  </td>
                  <td>{student.className}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={(e) => {
                        e.stopPropagation();   // prevents row click
                        onView(student);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(student.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}