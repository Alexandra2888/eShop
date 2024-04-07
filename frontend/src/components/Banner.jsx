import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Banner = () => {
  const { t } = useTranslation();

  return (
   
    <div className="flex flex-col md:flex-row justify-around space-x-4 dark:bg-gray-900 dark:text-white">
      <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6">
        <div className="flex flex-col max-w-2xl lg:mx-0">
            <h1 className="md:mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
            {t("banner_title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-slate-50">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
            fugiat veniam occaecat fugiat aliqua.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              to="/shop"
              className="rounded-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800  px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("shop_now")}
            </Link>
           
          </div>
        </div>
      </div>
      <div className="relative lg:col-span-5 lg:flex lg:items-center xl:mr-0">
  <img
    className="w-[20rem] md:w-[30rem] h-auto bg-gray-50 object-cover lg:max-h-[50vh]"
    src="https://images.unsplash.com/photo-1498758536662-35b82cd15e29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90oy1wYWgefHx8fGVufDB8fHx8&auto=format&fit=crop&w=2102&q=80"
    alt=""
  />
</div>
    </div>
    
  )
}

export default Banner;