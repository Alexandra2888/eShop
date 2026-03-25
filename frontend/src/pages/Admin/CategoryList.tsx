import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaTags, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import Metadata from "../../components/Metadata";

const inputClass =
  "w-full bg-zinc-800 border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-zinc-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-200";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result: any = await createCategory({ name }).unwrap();
      if (result.error) toast.error(result.error);
      else {
        setName("");
        toast.success(`"${result.name}" created`);
      }
    } catch (error) {
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result: any = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();
      if (result.error) toast.error(result.error);
      else {
        toast.success(`"${result.name}" updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`"${selectedCategory.name}" deleted`);
      setSelectedCategory(null);
      setModalVisible(false);
    } catch (error) {
      toast.error("Deletion failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Metadata title="Categories" />
      <AdminMenu />

      <main className="md:pl-56 px-6 py-8">
        <div className="mb-8">
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Admin
          </p>
          <h1 className="font-display text-3xl font-bold text-white">
            {t("manage_categories")}
          </h1>
        </div>

        <div className="max-w-2xl">
          {/* Create form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-6 mb-8"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FaPlus size={12} className="text-emerald-400" />
              Create Category
            </h3>
            <form onSubmit={handleCreateCategory} className="flex gap-3">
              <input
                type="text"
                placeholder="Category name…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
              <button
                type="submit"
                className="shrink-0 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-200"
              >
                {t("submit")}
              </button>
            </form>
          </motion.div>

          {/* Category chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <FaTags size={12} className="text-zinc-400" />
              All Categories
              <span className="text-xs font-normal text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full ml-1">
                {categories?.length ?? 0}
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {categories?.map((category: any, i: number) => (
                  <motion.button
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedCategory(category);
                      setUpdatingName(category.name);
                    }}
                    className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-emerald-500/10 border border-white/[0.08] hover:border-emerald-500/30 text-zinc-300 hover:text-emerald-400 text-sm rounded-xl transition-all duration-200"
                  >
                    {category.name}
                    <FaEdit
                      size={10}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Edit modal */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <h3 className="text-white font-semibold mb-5">Edit Category</h3>
        <form onSubmit={handleUpdateCategory}>
          <input
            type="text"
            value={updatingName}
            onChange={(e) => setUpdatingName(e.target.value)}
            className={`${inputClass} mb-4`}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleDeleteCategory}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors"
            >
              <FaTrash size={11} />
              {t("delete")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryList;
