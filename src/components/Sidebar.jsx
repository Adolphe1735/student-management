export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: "▦" },
    { key: "register", label: "Register Student", icon: "＋" },
    { key: "students", label: "All Students", icon: "👥" },
    { key: "settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">SMS</div>
          <div>
            <h2>EduAdmin</h2>
            <p>Student Manager</p>
          </div>
        </div>

        <nav className="nav-menu">
          {items.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.key);
                onClose?.();
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="nav-item logout">
          <span className="nav-icon">↩</span> Logout
        </button>
      </aside>
    </>
  );
}