export default function StudentDetails({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Student Details</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="details-body">
          <div className="avatar-large">
            {student.fullName.charAt(0).toUpperCase()}
          </div>
          <h3>{student.fullName}</h3>
          <span className="badge">{student.studentId}</span>

          <div className="details-grid">
            <Detail label="Email" value={student.email} />
            <Detail label="Phone" value={student.phone} />
            <Detail label="Gender" value={student.gender} />
            <Detail label="Class" value={student.className} />
            <Detail label="Address" value={student.address || "—"} full />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, full }) {
  return (
    <div className={`detail-item ${full ? "full" : ""}`}>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}