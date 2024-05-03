import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

import AdminMenu from "./AdminMenu";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";

const AdminProductUpdate = () => {
  const params = useParams();

  const { t } = useTranslation();

  const { data: productData } = useGetProductByIdQuery(params._id);

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.success("Item added successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // Update product using the RTK Query mutation
      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.success(`Product successfully updated`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });

      setIsModalOpen(false);
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="container my-12 md:ml-[10rem] xl:mx-[9rem] sm:mx-[0]">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3">
            <div className="h-12 text-center">{t("update_delete_product")}</div>

            {image && (
              <div className="text-center mx-auto max-w-xs md:max-w-md">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto w-full h-[40%]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 max-w-sm">
                {image ? image.name : "Upload image"}
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="text-white"
                />
              </label>
            </div>
            <div className="flex flex-col justify-center md:ml-[8rem]">
              <div className="p-3">
                <div className="flex flex-wrap">
                  <div className="one">
                    <label htmlFor="name"> {t("name")}</label> <br />
                    <Input
                      type="text"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-blac dark:bg-[#3A3A3A] dark:text-white mr-[5rem]"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="two">
                    <label htmlFor="name block"> {t("price")}</label> <br />
                    <Input
                      type="number"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-white "
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div>
                    <label htmlFor="name block"> {t("quantity")}</label> <br />
                    <Input
                      type="number"
                      min="1"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-white mr-[5rem]"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="name block"> {t("brand")}</label> <br />
                    <Input
                      type="text"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-white"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>
                </div>

                <label htmlFor="" className="my-5">
                  {t("description")}
                </label>
                <textarea
                  type="text"
                  className="p-2 mb-3  border rounded-lg w-[95%] bg-white text-black dark:bg-[#3A3A3A] dark:text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex flex-col justify-between">
                  <div>
                    <label htmlFor="name block"> {t("count_in_stock")}</label>{" "}
                    <br />
                    <Input
                      type="text"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-white "
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor=""> {t("category")}</label> <br />
                    <select
                      placeholder="Choose Category"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black dark:bg-[#3A3A3A] dark:text-white mr-[5rem]"
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
              </div>
              <div className="">
                <Button
                  onClick={handleSubmit}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-700 text-slate-50  mr-6"
                >
                  {t("update")}
                </Button>
                <Button
                  onClick={handleDeleteClick}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-red-600"
                >
                  {t("delete")}
                </Button>

                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <p className="text-black"> {t("delete_product")} </p>
                  <div className="flex justify-between">
                    <Button
                      onClick={confirmDelete}
                      className="py-2 px-5 mt-5 rounded-lg text-lg font-bold  bg-red-600"
                    >
                      {t("confirm")}
                    </Button>
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      className="p2-4 px-5 mt-5 rounded-lg text-lg font-bold  bg-gray-600"
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminProductUpdate;
