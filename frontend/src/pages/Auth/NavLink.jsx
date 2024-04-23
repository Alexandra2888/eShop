import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClass = isActive
    ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-600 text-white"
    : "text-white";
  const classNames = `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold dark:text-gray-900 ${activeClass}`;

  return (
    <li>
      <Link to={to} className={classNames}>
        {children}
      </Link>
    </li>
  );
};

export default NavLink;
