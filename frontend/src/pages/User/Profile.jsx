import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

import Loader from "../../components/Loader";
import Metadata from "../../components/Metadata";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Metadata title={"Profile"} />
      <section className="container mx-auto p-4 mt-[10rem]">
        <div className="flex justify-center align-center md:flex md:space-x-4">
          <div className="md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">
              {t("update_profile")}
            </h2>
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-white mb-2">{t("name")}</label>
                <Input
                  type="text"
                  placeholder="Enter name"
                  className="form-input p-4 rounded-sm w-full"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-white mb-2">{t("email")}</label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  className="form-input p-4 rounded-sm w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-white mb-2">{t("password")}</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  className="form-input p-4 rounded-sm w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-white mb-2">
                  {t("confirm_password")}
                </label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  className="form-input p-4 rounded-sm w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  {t("update")}
                </Button>

                <Link
                  to="/user-orders"
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  {t("my_orders")}
                </Link>
              </div>
              {loadingUpdateProfile && <Loader />}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
