import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          <span className="block">{t("ready_for_tech")}</span>
          <span className="block">{t("check_latest_collection")}</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md  hover:underline hover:cursor-pointer hover:text-sm"
            >
              {t("shop_now")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
