import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MessageProps {
  variant?: "success" | "succcess" | "error" | "info" | string;
  children: ReactNode;
}

const Message = ({ variant, children }: MessageProps) => {
  const styles = {
    success: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    succcess: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    error: "bg-red-500/10 border border-red-500/20 text-red-400",
    danger: "bg-red-500/10 border border-red-500/20 text-red-400",
    info: "bg-blue-500/10 border border-blue-500/20 text-blue-400",
  };

  const cls =
    styles[variant as string] ??
    "bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`px-4 py-3 rounded-xl text-sm font-medium ${cls}`}
    >
      {children}
    </motion.div>
  );
};

export default Message;
