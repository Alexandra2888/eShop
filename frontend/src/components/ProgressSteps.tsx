import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const steps = [
  { key: "step1", labelKey: "login" },
  { key: "step2", labelKey: "shipping" },
  { key: "step3", labelKey: "summary" },
];

const ProgressSteps = ({ step1, step2, step3 = false }) => {
  const { t } = useTranslation();
  const active = [step1, step2, step3];

  return (
    <div className="flex items-center justify-center gap-0 my-8 px-4">
      {steps.map((step, i) => {
        const isActive = active[i];
        const isCompleted = active[i] && i < active.lastIndexOf(true);
        const showConnector = i < steps.length - 1;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive ? "#10b981" : "transparent",
                  borderColor: isActive ? "#10b981" : "#3f3f46",
                }}
                className="w-9 h-9 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-colors duration-300"
              >
                {isCompleted ? (
                  <FaCheck size={12} className="text-white" />
                ) : (
                  <span className={isActive ? "text-white" : "text-zinc-500"}>
                    {i + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? "text-emerald-500"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {t(step.labelKey)}
              </span>
            </div>
            {showConnector && (
              <div className="w-16 sm:w-24 h-0.5 mb-5 mx-1">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: active[i] && active[i + 1] ? 1 : 0 }}
                  className="h-full bg-emerald-500 origin-left"
                  transition={{ duration: 0.4 }}
                />
                <div
                  className="h-full bg-zinc-200 dark:bg-zinc-800 -mt-0.5"
                  style={{ zIndex: -1 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
