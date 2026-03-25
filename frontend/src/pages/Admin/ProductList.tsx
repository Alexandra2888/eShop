import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

import AdminMenu from "./AdminMenu";
import Metadata from "../../components/Metadata";

const fieldClass =
  "w-full bg-zinc-800 border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-zinc-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-200";

const labelClass =
  "block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2";

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      if (data?.error) toast.error(data.error);
      else {
        toast.success(`"${data?.name}" created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error("Product creation failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Metadata title="Create Product" />
      <AdminMenu />

      <main className="md:pl-56 px-6 py-8">
        <div className="mb-8">
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Admin
          </p>
          <h1 className="font-display text-3xl font-bold text-white">
            {t("create_product")}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl bg-zinc-900 border border-white/[0.06] rounded-2xl p-8"
        >
          {/* Image preview */}
          {image && (
            <div className="mb-6 flex justify-center">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10">
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image URL */}
            <div>
              <label className={labelClass}>{t("image_url")}</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className={fieldClass}
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            {/* Name + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t("name")}</label>
                <input
                  type="text"
                  className={fieldClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>{t("price")}</label>
                <input
                  type="number"
                  className={fieldClass}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Quantity + Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t("quantity")}</label>
                <input
                  type="number"
                  className={fieldClass}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>{t("brand")}</label>
                <input
                  type="text"
                  className={fieldClass}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>{t("description")}</label>
              <textarea
                rows={4}
                className={`${fieldClass} resize-none`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Stock + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t("count_in_stock")}</label>
                <input
                  type="number"
                  className={fieldClass}
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className={labelClass}>{t("category")}</label>
                <select
                  className={`${fieldClass} cursor-pointer`}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category…</option>
                  {categories?.map((c: any) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-200"
              >
                {t("submit")}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default ProductList;
