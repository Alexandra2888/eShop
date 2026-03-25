import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
