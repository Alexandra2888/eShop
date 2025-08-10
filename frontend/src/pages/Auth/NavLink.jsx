import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClass = isActive
    ? "text-white"
    : "text-white";
  const classNames = `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold  ${activeClass}`;

  return (
    <Link to={to} className={className || classNames}>
      {children}
    </Link>
  );
};

export default NavLink;
