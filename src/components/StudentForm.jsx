import { useState } from "react";
import throttle from "../utils/throttle";

const INITIAL = {
  fullName: "",
  studentId: "",
  email: "",
  phone: "",
  gender: "",
  className: "",
  address: "",
};

export default function StudentForm({ onSave, onClose, existingStudents }) {
  const [form, setForm] = useState(INITIAL);        // controlled state
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Full name is required.";
    if (!form.studentId.trim()) err.studentId = "Student ID is required.";
    else if (existingStudents.some((s) => s.studentId === form.studentId.trim()))
      err.studentId = "This Student ID already exists.";

    if (!form.email.trim()) err.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter a valid email address.";

    if (!form.phone.trim()) err.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone.trim()))
      err.phone = "Phone must be exactly 10 digits.";

    if (!form.gender) err.gender = "Please select gender.";
    if (!form.className.trim()) err.className = "Class is required.";
    return err;
  };

  // Throttled submit prevents accidental double-submission
  const handleSubmit = throttle((e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    onSave({
      ...form,
      id: Date.now(),
      fullName: form.fullName.trim(),
      studentId: form.studentId.trim(),
    });
    setForm(INITIAL);
  }, 800);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Register New Student</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid" noValidate>
          <Field label="Full Name" error={errors.fullName}>
            <input name="fullName" value={form.fullName} onChange={handleChange}
              placeholder="e.g. Amara Okafor" />
          </Field>

          <Field label="Student ID" error={errors.studentId}>
            <input name="studentId" value={form.studentId} onChange={handleChange}
              placeholder="e.g. STU-2024-005" />
          </Field>

          <Field label="Email" error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="name@school.edu" />
          </Field>

          <Field label="Phone Number" error={errors.phone}>
            <input name="phone" value={form.phone} onChange={handleChange}
              placeholder="10-digit number" maxLength={10} />
          </Field>

          <Field label="Gender" error={errors.gender}>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </Field>

          <Field label="Class" error={errors.className}>
            <input name="className" value={form.className} onChange={handleChange}
              placeholder="e.g. Grade 10A" />
          </Field>

          <Field label="Address" className="full">
            <textarea name="address" value={form.address} onChange={handleChange}
              placeholder="Street, city, state" rows={3} />
          </Field>

          <div className="form-actions full">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Student</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, className = "", children }) {
  return (
    <div className={`field ${className}`}>
      <label>{label}</label>
      {children}
      {error && <span className="error">{error}</span>}
    </div>
  );
}