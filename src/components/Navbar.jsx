export default function Navbar({ title, onMenuClick, onRegister }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuClick}>☰</button>
        <h1>{title}</h1>
      </div>
      <div className="navbar-right">
        <button className="btn btn-sm btn-primary" onClick={onRegister}>
          + New Student
        </button>
        <div className="profile">
          <div className="avatar">A</div>
          <div className="profile-info">
            <span className="name">Admin</span>
            <span className="role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}