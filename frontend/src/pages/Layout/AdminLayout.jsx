import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import Navigation from "../Auth/Navigation";

const AdminLayout = () => {
  return (
    <main>
      <Navigation />
      <main className="py-3 dark:bg-[#3A3A3A] dark:text-slate-50">
        <Outlet />
      </main>
      <Footer />
    </main>
  );
};

export default AdminLayout;
