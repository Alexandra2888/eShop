import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaShoppingBag } from "react-icons/fa";

import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

import Loader from "../../components/Loader";
import Metadata from "../../components/Metadata";

const fieldClass =
  "w-full bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-200";
const labelClass =
  "block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state: any) => state.auth);
  const [updateProfile, { isLoading }] = useProfileMutation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Metadata title="Profile" />
      <div className="min-h-screen bg-white dark:bg-zinc-950 pb-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="mb-8">
              <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
                Account
              </p>
              <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                {t("update_profile")}
              </h1>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                <FaUser size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {userInfo.username}
                </p>
                <p className="text-sm text-zinc-400">{userInfo.email}</p>
              </div>
              <Link
                to="/user-orders"
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-600 dark:text-zinc-300 rounded-xl hover:border-emerald-500 hover:text-emerald-500 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all duration-200"
              >
                <FaShoppingBag size={12} />
                {t("my_orders")}
              </Link>
            </div>

            {/* Form */}
            <form
              onSubmit={submitHandler}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-6 space-y-5"
            >
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <FaUser size={9} />
                    {t("name")}
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className={fieldClass}
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <FaEnvelope size={9} />
                    {t("email")}
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className={fieldClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <FaLock size={9} />
                    {t("password")}
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="New password"
                  className={fieldClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <FaLock size={9} />
                    {t("confirm_password")}
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className={fieldClass}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-200"
                >
                  {isLoading ? <Loader /> : t("update")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;
