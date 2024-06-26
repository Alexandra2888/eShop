import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClass = isActive
    ? "text-white"
    : "text-white";
  const classNames = `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold  ${activeClass}`;

  return (
    <li>
      <Link to={to} className={classNames}>
        {children}
      </Link>
    </li>
  );
};

export default NavLink;
