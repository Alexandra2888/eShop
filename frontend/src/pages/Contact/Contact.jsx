import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Loader";
import Metadata from "../../components/Metadata";
import { toast } from "react-toastify";
import { contactSchema } from "./Schema/ContactSchema";
import Button from "../../components/Button";
import Input from "../../components/Input";

import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { t } = useTranslation();

  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset validation errors
    setValidationErrors({});

    // Validate form data
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const errors = result.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await emailjs.send(
        "service_39dkf2b",
        "template_u9h5t7j",
        form,
        "nhWo1nAjrBMRvUeuF"
      );
      toast.success("Thanks! We will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error.text);
      toast.error("Oops, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Metadata title={"Contact"} />
      <div className="isolate  px-6 py-24 sm:py-32 lg:px-8 0 ">
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {t("drop_message")}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 max-w-xl sm:mt-20"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="mt-2.5">
                <label
                  htmlFor="name"
                  aria-label="name"
                  aria-labelledby="name"
                  id="name"
                  title="name"
                  className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  {t("name")}

                  <Input
                    type="text"
                    name="name"
                    aria-label="name"
                    aria-labeledby="name"
                    value={form.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                  />
                </label>
                {validationErrors.name && (
                  <div className="text-red-500">{validationErrors.name}</div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="mt-2.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                  aria-label="email"
                  aria-labelledby="email"
                  id="email"
                  title="email"
                >
                  {t("email")}

                  <Input
                    type="email"
                    name="email"
                    aria-label="email"
                    aria-labeledby="email"
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                  />
                </label>
                {validationErrors.email && (
                  <div className="text-red-500">{validationErrors.email}</div>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="mt-2.5">
                <label
                  htmlFor="message"
                  aria-label="message"
                  id="message"
                  title="message"
                  className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  {t("message")}
                </label>
                <textarea
                  name="message"
                  aria-label="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                />
                {validationErrors.message && (
                  <div className="text-red-500">{validationErrors.message}</div>
                )}
              </div>
            </div>
            <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center">
                <Switch
                  checked={agreed}
                  onChange={setAgreed}
                  className={classNames(
                    agreed ? "bg-blue-800" : "bg-gray-200",
                    "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                  )}
                >
                  <span className="sr-only">Agree to policies</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      agreed ? "translate-x-3.5" : "translate-x-0",
                      "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </div>
              <Switch.Label className="text-sm leading-6 text-gray-600 dark:text-white">
                By selecting this, you agree to our{" "}
                <a
                  href="#"
                  className="font-normal text-gray-900 dark:text-slate-50 underline"
                >
                  privacy&nbsp;policy
                </a>
                .
              </Switch.Label>
            </Switch.Group>
          </div>
          <div className="mt-10">
            <Button
              type="submit"
              className="block w-full rounded-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              {isLoading ? "Sending message" : "Send message"}
            </Button>
            {isLoading && <Loader />}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
