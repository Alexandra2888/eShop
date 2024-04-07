import { useTranslation } from "react-i18next";


const ProgressSteps = ({ step1, step2, step3 }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center space-x-4">
      <div className={`${step1 ? "text-blue-600" : "text-gray-300"}`}>
        <span className="ml-2">
        {t('login')}
          </span>
        <div className="mt-2 text-lg text-center">👉</div>
      </div>

      {step2 && (
        <>
          {step1 && <div className="h-0.5 w-[10rem] bg-blue-600"></div>}
          <div className={`${step1 ? "text-blue-600" : "text-gray-300"}`}>
            <span>
            {t('shipping')}
            </span>
            <div className="mt-2 text-lg text-center">👉</div>
          </div>
        </>
      )}

      <>
        {step1 && step2 && step3 ? (
          <div className="h-0.5 w-[10rem] bg-blue-600"></div>
        ) : (
          ""
        )}

        <div className={`${step3 ? "text-blue-600" : "text-gray-300"}`}>
          <span className={`${!step3 ? "ml-[10rem]" : ""}`}>
          {t('summary')}
            </span>
          {step1 && step2 && step3 ? (
            <div className="mt-2 text-lg text-center">👉</div>
          ) : (
            ""
          )}
        </div>
      </>
    </div>
  );
};

export default ProgressSteps;
