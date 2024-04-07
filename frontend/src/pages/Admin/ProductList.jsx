import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";


import AdminMenu from "./AdminMenu";
import Metadata from "../../components/Metadata";
import Button from "../../components/Button";
import Input from '../../components/Input';

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();


  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
    <Metadata title={"Products"} />

    <div className="container md:ml-[15rem] my-12">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-center">  {t('create_product')}</div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload Image"}

              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">{t('name')}</label> <br />
                <Input
                  type="text"
                  className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-slate-50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="two md:ml-10 ">
                <label htmlFor="name block">{t('price')}</label> <br />
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
                <label htmlFor="name block">{t('quantity')}</label> <br />
                <Input
                  type="number"
                  className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-slate-50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="two md:ml-10 ">
                <label htmlFor="name block">  {t('brand')}</label> <br />
                <Input
                  type="text"
                  className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-slate-50"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">
            {t('description')}
            </label>
            <textarea
              type="text"
              className="p-2 mb-3 bg-white dark:bg-[#3A3A3A] dark:text-slate-50 border rounded-lg w-[95%] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex flex-col md:flex-row md:justify-between">
              <div>
                <label htmlFor="name block">{t('count_in_stock')}</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 md:w-[30rem] border rounded-lg bg-white dark:bg-[#3A3A3A] dark:text-slate-50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="">{t('category')}</label> <br />
                <select
                  placeholder="Choose Category"
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
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 "
            >
                {t('submit')}
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductList;
