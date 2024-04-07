import { useState, useEffect } from "react";
import { Link,  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

import Loader from "../../components/Loader";
import Metadata from "../../components/Metadata";
import { registerSchema } from "./Schemas/RegisterSchema";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);


  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    setValidationErrors({});

    const result = registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const newErrors = result.error.errors.reduce((acc, { path, message }) => {
        acc[path[0]] = message;
        return acc;
      }, {});
      setValidationErrors(newErrors);

      if (password !== confirmPassword) {
        setValidationErrors((errors) => ({
          ...errors,
          confirmPassword: "Passwords do not match.",
        }));
      }
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
      toast.success("User successfully registered");
    } catch (err) {
      console.error(err);
      toast.error(err.data.message || "An error occurred during registration.");
    }
  };

  return (
    <>
      <Metadata title={"Register"} />
      <div className="isolate  px-6 py-24 sm:py-32 lg:px-8 ">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg]  opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-slate-50">
            {t("register")}
          </h2>
        </div>
        <form
          onSubmit={submitHandler}
          className="mx-auto mt-16 max-w-xl sm:mt-20"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-slate-50"
              >
                {t("name")}
              </label>
              <div className="mt-2.5">
                <Input
                  type="text"
                  name="name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                />
                {validationErrors.name && (
                  <div className="text-red-500">{validationErrors.name}</div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-slate-50"
              >
                {t("email")}
              </label>
              <div className="mt-2.5">
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                />
                {validationErrors.email && (
                  <div className="text-red-500">{validationErrors.email}</div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold leading-6 text-gray-900dark:text-slate-50"
              >
                {t("password")}
              </label>
              <div className="mt-2.5">
                <Input
                  type="password"
                  name="passowrd"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                />
                {validationErrors.password && (
                  <div className="text-red-500">
                    {validationErrors.password}
                  </div>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-slate-50"
              >
                {t("confirm_password")}
              </label>
              <div className="mt-2.5">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                />
                {validationErrors.confirmPassword && (
                  <div className="text-red-500">
                    {validationErrors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <Button
              type="submit"
              className="block w-full rounded-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
               {isLoading ? "Registering..." : "Register"}
            </Button>
            {isLoading && <Loader />}
          </div>
          <div className="mt-2.5">
            <p className="text-gray-800 dark:text-slate-50">
            {t('have_account')}{" "}
            <Link
              to={ "/login"}
              className="text-blue-500 hover:underline"
            >
                {t('login')}
                </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
