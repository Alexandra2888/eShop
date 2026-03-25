import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <> 
      <div className="relative w-full mx-24">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg0fHxnYWRnZXRzfGVufDB8fDB8fHww"
          alt="Tech upgrade"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#FFD1AC] opacity-30"></div> 
      </div>

      <section className="relative py-24 px-4 sm:px-6 lg:py-32 lg:px-8 text-slate-600 flex justify-between items-center">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
          <span className="block">{t("ready_for_tech")}</span>
          <span className="block text-green-300">{t("check_latest_collection")}</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-800 bg-white hover:bg-green-700 hover:text-white"
            >
              {t("shop_now")}
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Banner;
