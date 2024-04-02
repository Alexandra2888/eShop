import { Link } from "react-router-dom";
import Metadata from "../../components/Metadata";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
    <Metadata title={"Not Found"} />
    <main className="flex flex-col justify-center items-center h-screen"> 
      <div className="flex"> 
      <div className="flex flex-col justify-center items-center mx-auto">
        <h2 className="font-semibold">
        {t('not_found')}
         </h2>
        <Link to="/" className="w-fit bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-4">{t('home')}</Link> 
        </div>
        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
          alt="Not Found"
          className="w-[50%] h-fit mx-auto" 
        />
      </div>
    </main>
    </>
  );
};

export default NotFound;
