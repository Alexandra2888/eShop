/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";

import Button from "../components/Button";
import Input from "../components/Input";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  const { t } = useTranslation();

  return (
    <section className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          className="py-3 px-4 border rounded-lg w-full"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between">
          <Button className="bg-green-700 text-slate-50 py-2 px-4 rounded-lg  focus:outline-none focus:ring-2 foucs:ring-green-500 focus:ring-opacity-50">
            {buttonText}
          </Button>

          {handleDelete && (
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 foucs:ring-red-500 focus:ring-opacity-50"
            >
              {t("delete")}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default CategoryForm;
