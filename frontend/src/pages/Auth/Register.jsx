import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
  
    setValidationErrors({});
  
    const result = registerSchema.safeParse({ username, email, password, confirmPassword });
    if (!result.success) {
      const newErrors = result.error.errors.reduce((acc, { path, message }) => {
        acc[path[0]] = message;
        return acc;
      }, {});
      setValidationErrors(newErrors);
  
      if (password !== confirmPassword) {
        setValidationErrors(errors => ({ ...errors, confirmPassword: "Passwords do not match." }));
      }
      return; 
    }
  
    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (err) {
      console.error(err);
      toast.error(err.data.message || "An error occurred during registration.");
    }
  };
  

  return (
    <>
    <Metadata title={"Register"} />
    <section className="pl-[10rem] flex flex-wrap">
      <div className="mr-[4rem] mt-[5rem]">
        <h1 className="text-2xl font-semibold mb-4">  {t('register')}</h1>

        <form onSubmit={submitHandler} className="container w-[40rem]">
          <div className="my-[2rem]">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
                {t('name')}
            </label>
            <Input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.username && <div className="text-red-500">{validationErrors.username}</div>}
          </div>

          <div className="my-[2rem]">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
                {t('email_address')}
            </label>
            <Input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
              {validationErrors.email && <div className="text-red-500">{validationErrors.email}</div>}
          </div>

          <div className="my-[2rem]">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
                {t('password')}
            </label>
            <Input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
              {validationErrors.password && <div className="text-red-500">{validationErrors.password}</div>}
          </div>

          <div className="my-[2rem]">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
               {t('confirm_password')}
            </label>
            <Input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="my-[2rem]">
  {validationErrors.confirmPassword && <div className="text-red-500">{validationErrors.confirmPassword}
  </div>}
</div>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white">
          {t('have_account')}?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
                {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default Register;
