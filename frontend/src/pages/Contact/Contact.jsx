import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Loader";
import Metadata from "../../components/Metadata";
import { toast } from "react-toastify";
import { contactSchema } from "./Schema/ContactSchema";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { t } = useTranslation();

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
    <div>
      <Metadata title={"Contact"} />
      <section className="pl-[10rem] flex flex-wrap">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">  {t('drop_message')}</h1>
          <form onSubmit={handleSubmit} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                  {t('name')}
              </label>
              <Input
                type="text"
                name="name"
                className="mt-1 p-2 border rounded w-full"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
              />
              {validationErrors.name && (
                <div className="text-red-500">{validationErrors.name}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                  {t('email')}
              </label>
              <Input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email?"
              />
              {validationErrors.email && (
                <div className="text-red-500">{validationErrors.email}</div>
              )}
            </div>

            <div className="w-full md:w-1/2 px-4 mb-12">
              <label>
              {t('message')}
              </label>
              <textarea
                value={form.message}
                onChange={handleChange}
                placeholder="Please leave your message..."
                name="message"
                rows="5"
                cols="15"
                className="mt-1 p-2 border rounded w-full"
                type="text"
              />

              {validationErrors.message && (
                <div className="text-red-500">{validationErrors.message}</div>
              )}
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isLoading ? "Sending message" : "Send message"}
            </Button>
            {isLoading && <Loader />}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
