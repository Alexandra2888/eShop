import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";
import Modal from "../../components/Modal";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const { t } = useTranslation();

  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id).unwrap();
      toast.success("User deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const toggleEdit = (id: string, username: string, email: string) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id: string) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const editInput =
    "w-full bg-zinc-800 border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white text-sm px-3 py-2 rounded-xl outline-none transition-all duration-200";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AdminMenu />
      <main className="md:pl-56 px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Admin
          </p>
          <h1 className="font-display text-3xl font-bold text-white">
            {t("manage_users")}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="error">{t("error_message")}</Message>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-zinc-900 border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            {/* Table header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-white font-semibold">
                {t("users")}
                <span className="ml-2 text-xs font-normal text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {users?.length}
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[t("name"), t("email"), t("admin"), "Actions"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users?.map((user: any, i: number) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center shrink-0">
                            <FaUser size={11} className="text-zinc-400" />
                          </div>
                          {editableUserId === user._id ? (
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) =>
                                setEditableUserName(e.target.value)
                              }
                              className={editInput}
                            />
                          ) : (
                            <span className="text-zinc-200 font-medium">
                              {user.username}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {editableUserId === user._id ? (
                          <input
                            type="email"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className={editInput}
                          />
                        ) : (
                          <a
                            href={`mailto:${user.email}`}
                            className="text-zinc-400 hover:text-emerald-400 transition-colors"
                          >
                            {user.email}
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20">
                            <FaShieldAlt size={8} /> Admin
                          </span>
                        ) : (
                          <span className="text-zinc-600 text-xs">User</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {editableUserId === user._id ? (
                            <>
                              <button
                                onClick={() => updateHandler(user._id)}
                                aria-label={`Save changes for ${user.username}`}
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              >
                                <FaCheck size={11} />
                              </button>
                              <button
                                onClick={() => setEditableUserId(null)}
                                aria-label={`Cancel editing ${user.username}`}
                                className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
                              >
                                <FaTimes size={11} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    user._id,
                                    user.username,
                                    user.email,
                                  )
                                }
                                aria-label={`Edit ${user.username}`}
                                className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
                              >
                                <FaEdit size={11} />
                              </button>
                              <button
                                onClick={() => deleteHandler(user)}
                                aria-label={`Delete ${user.username}`}
                                className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                              >
                                <FaTrash size={11} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <FaTrash size={16} className="text-red-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Delete User?</h3>
          <p className="text-zinc-400 text-sm mb-6">{t("delete_user")}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={confirmDelete}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t("confirm")}
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-sm font-medium rounded-xl transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
