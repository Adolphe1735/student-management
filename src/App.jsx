
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// CUSTOM HOOK 1: Debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// CUSTOM HOOK 2: Keyboard shortcuts
function useKeyboardShortcuts(searchRef, clearSearch) {
  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        clearSearch();
        searchRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchRef, clearSearch]);
}

// CUSTOM HOOK 3: Throttling
function useThrottle(callback, delay) {
  const lastRun = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();

    if (now - lastRun.current >= delay) {
      lastRun.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}

function App() {
  // STATE MANAGEMENT
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Peter",
      email: "john@gmail.com",
      age: 20,
      course: "Software Development",
      phone: "0788123456"
    },
    {
      id: 2,
      name: "Mary Jane",
      email: "mary@gmail.com",
      age: 22,
      course: "Networking",
      phone: "0788234567"
    }
  ]);

  // CONTROLLED COMPONENTS
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    course: "",
    phone: ""
  });

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [parentClicks, setParentClicks] = useState(0);

  const searchRef = useRef(null);

  // DEBOUNCED SEARCH
  const debouncedSearch = useDebounce(search, 400);

  // KEYBOARD SHORTCUTS
  const clearSearch = useCallback(() => setSearch(""), []);

  useKeyboardShortcuts(searchRef, clearSearch);

  // HANDLE INPUT CHANGES
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // REGISTER STUDENT + FORM VALIDATION
  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.age ||
      !formData.course ||
      !formData.phone.trim()
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.age)) ||
      Number(formData.age) < 1 ||
      Number(formData.age) > 120
    ) {
      setMessage("Please enter a valid age.");
      return;
    }

    if (students.some(s => s.email.toLowerCase() === formData.email.trim().toLowerCase())) {
      setMessage("A student with this email already exists.");
      return;
    }

    const newStudent = {
      id: Date.now(),
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: Number(formData.age)
    };

    setStudents(prev => [...prev, newStudent]);

    setFormData({
      name: "",
      email: "",
      age: "",
      course: "",
      phone: ""
    });

    setMessage("Student registered successfully!");
  }

  // DELETE STUDENT + FILTER
  const deleteStudent = useCallback((id) => {
    setStudents(prev => prev.filter(student => student.id !== id));

    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }

    setMessage("Student deleted successfully.");
  }, [selectedStudent]);

  // THROTTLING: Prevent repeated delete actions
  const throttledDelete = useThrottle(deleteStudent, 1000);

  // SEARCH STUDENTS
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    student.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    student.course.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>🎓 StudentPro</h2>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#register">Register Student</a>
          <a href="#students">Students</a>
        </nav>

        <div className="admin">
          <div className="avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <small>System Manager</small>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <h1>Student Management</h1>
            <p>Manage your student records efficiently.</p>
          </div>
          <span className="admin-badge">Administrator</span>
        </header>

        {/* DASHBOARD STATISTICS */}
        <section className="stats" id="dashboard">
          <div className="stat-card">
            <span>Total Students</span>
            <h2>{students.length}</h2>
          </div>

          <div className="stat-card">
            <span>Software Development</span>
            <h2>
              {students.filter(s => s.course === "Software Development").length}
            </h2>
          </div>

          <div className="stat-card">
            <span>Networking</span>
            <h2>
              {students.filter(s => s.course === "Networking").length}
            </h2>
          </div>
        </section>

        {/* SUCCESS / ERROR MESSAGE */}
        {message && (
          <div className="message">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {/* REGISTRATION FORM */}
        <section className="panel" id="register">
          <h2>Register New Student</h2>
          <p className="subtitle">Enter student information below.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@gmail.com"
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0780000000"
                />
              </div>

              <div className="form-group full-width">
                <label>Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">Select course</option>
                  <option value="Software Development">
                    Software Development
                  </option>
                  <option value="Networking">Networking</option>
                  <option value="Database Management">
                    Database Management
                  </option>
                  <option value="Multimedia">Multimedia</option>
                </select>
              </div>

            </div>

            <button type="submit" className="primary-btn">
              + Register Student
            </button>
          </form>
        </section>

        {/* STUDENT LIST */}
        <section className="panel" id="students">
          <div className="list-header">
            <div>
              <h2>Student Records</h2>
              <p className="subtitle">
                Manage all registered students.
              </p>
            </div>

            <input
              ref={searchRef}
              className="search-input"
              type="search"
              placeholder="Search students... (Ctrl + K)"
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>{student.name}</strong>
                    </td>

                    <td>{student.email}</td>
                    <td>{student.age}</td>
                    <td>
                      <span className="course-badge">
                        {student.course}
                      </span>
                    </td>

                    <td className="actions">
                      <button
                        className="view-btn"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => throttledDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* STUDENT DETAILS MODAL */}
        {selectedStudent && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedStudent(null)}
          >
            <div
              className="modal"
              onClick={event => event.stopPropagation()}
            >
              <h2>Student Details</h2>

              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Age:</strong> {selectedStudent.age}</p>
              <p><strong>Phone:</strong> {selectedStudent.phone}</p>
              <p><strong>Course:</strong> {selectedStudent.course}</p>

              <button
                className="primary-btn"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* EVENT BUBBLING DEMONSTRATION */}
        <section className="panel">
          <h2>Event Bubbling Demonstration</h2>

          <div
            className="bubble-box"
            onClick={() => setParentClicks(prev => prev + 1)}
          >
            <p>Parent clicked: {parentClicks} times</p>

            <button
              className="view-btn"
              onClick={event => {
                event.stopPropagation();
                alert("Child clicked! Parent event was stopped.");
              }}
            >
              Click Child Button
            </button>

            <small>
              Clicking outside the child button triggers the parent.
            </small>
          </div>
        </section>

        <footer>
          StudentPro © 2026 | Student Management System
        </footer>

      </main>
    </div>
  );
}

export default App;
