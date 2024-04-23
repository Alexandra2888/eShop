import { Link } from "react-router-dom";
import Metadata from "../../components/Metadata";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={"Not Found"} />
      <main className="grid min-h-full place-items-center bg-white text-black px-6 sm:py-32 lg:px-8 dark:bg-[#3A3A3A] dark:text-slate-50 h-screen">
        <div className="text-center">
          <p className="text-base font-semibold text-blue-600">404</p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight  sm:text-4xl dark:text-slate-50">
            {t("not_found")}
          </h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800  px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("home")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
