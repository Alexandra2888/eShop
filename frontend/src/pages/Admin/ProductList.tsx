import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

import AdminMenu from "./AdminMenu";
import Metadata from "../../components/Metadata";
import Button from "../../components/Button";
import Input from "../../components/Input";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createProduct({
        name,
        image,
        description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        brand,
        countInStock: stock,
      } as any);
      const data = (result as any).data;

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data?.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  return (
    <>
      <Metadata title={"Products"} />
      <section className="container md:ml-[15rem] py-12">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3">
            <div className="h-12 text-center"> {t("create_product")}</div>

            {image && (
              <div className="text-center">
                <img
                  src={image}
                  alt="product preview"
                  className="block mx-auto max-h-[200px] object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="block text-white mb-2 font-semibold">{t("image_url")}</label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="p-4 mb-3 w-full border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-slate-50"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">{t("name")}</label> <br />
                  <Input
                    type="text"
                    className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-slate-50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="two md:ml-10 ">
                  <label htmlFor="name block">{t("price")}</label> <br />
                  <Input
                    type="number"
                    className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-slate-50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name block">{t("quantity")}</label> <br />
                  <Input
                    type="number"
                    className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-slate-50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="two md:ml-10 ">
                  <label htmlFor="name block"> {t("brand")}</label> <br />
                  <Input
                    type="text"
                    className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-slate-50"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="" className="my-5">
                {t("description")}
              </label>
              <textarea
                className="p-2 mb-3 bg-white dark:bg-[#3A3A3A] dark:text-slate-50 border rounded-lg w-[95%] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <label htmlFor="name block">{t("count_in_stock")}</label>{" "}
                  <br />
                  <input
                    type="text"
                    className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white dark:bg-[#3A3A3A] dark:text-slate-50"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label htmlFor="">{t("category")}</label> <br />
                  <select
                    className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white dark:bg-[#3A3A3A] dark:text-slate-50"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-700 text-slate-50"
              >
                {t("submit")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductList;
