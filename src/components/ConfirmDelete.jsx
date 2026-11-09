import { useState } from "react";
import throttle from "../utils/throttle";

export default function ConfirmDelete({ student, onConfirm, onCancel }) {
  const [processing, setProcessing] = useState(false);

  const handleConfirm = throttle(() => {
    setProcessing(true);
    onConfirm(student.id);
  }, 800);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">⚠️</div>
        <h2>Delete Student?</h2>
        <p>
          Are you sure you want to delete <strong>{student.fullName}</strong>?
          This action cannot be undone.
        </p>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={processing}
          >
            {processing ? "Deleting..." : "Delete Student"}
          </button>
        </div>
      </div>
    </div>
  );
}