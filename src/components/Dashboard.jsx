export default function Dashboard({ students, onView, onRegister }) {
  const total = students.length;
  const male = students.filter((s) => s.gender === "Male").length;
  const female = students.filter((s) => s.gender === "Female").length;
  const recent = [...students].slice(-3).reverse();

  return (
    <div className="dashboard">
      <div className="welcome-card">
        <div>
          <h2>Welcome back, Admin 👋</h2>
          <p>Here's what's happening with your students today.</p>
        </div>
        <button className="btn btn-primary" onClick={onRegister}>
          Register Student
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Students" value={total} icon="👥" color="royal" />
        <StatCard label="Male Students" value={male} icon="♂" color="navy" />
        <StatCard label="Female Students" value={female} icon="♀" color="pink" />
        <StatCard
          label="Classes"
          value={new Set(students.map((s) => s.className)).size}
          icon="🏫"
          color="green"
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Recently Registered</h2>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <p>No students yet. Register your first student!</p>
          </div>
        ) : (
          <div className="recent-list">
            {recent.map((s) => (
              <div key={s.id} className="recent-item" onClick={() => onView(s)}>
                <div className="avatar">{s.fullName.charAt(0).toUpperCase()}</div>
                <div className="recent-info">
                  <span className="name">{s.fullName}</span>
                  <span className="meta">{s.studentId} · {s.className}</span>
                </div>
                <span className={`gender-pill ${s.gender.toLowerCase()}`}>
                  {s.gender}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}