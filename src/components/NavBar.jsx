import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/lists', label: 'Lists' },
  { to: '/profile', label: 'Profile' },
];

export default function NavBar() {
  return (
    <nav className="bottom-nav">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
