import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";
import Metadata from "../../components/Metadata";
import Button from "../../components/Button";
import Input from "../../components/Input";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  const { t } = useTranslation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4 my-12 md:ml-[10rem]">
      <h1 className="text-2xl font-semibold my-4 text-black dark:text-slate-50 text-center">{t('users')}</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{t('error_message')}</Message>
        ) : (
            <div>
               <AdminMenu />
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">{t('name')}</th>
                <th className="px-4 py-2 text-left">{t('email')}</th>
                <th className="px-4 py-2 text-left">{t('admin')}</th>
              </tr>
            </thead>
            <tbody>
    {users.map((user) => (
      <tr key={user._id} className="border-b dark:border-gray-600">
        <td className="px-4 py-2">
          {editableUserId === user._id ? (
            <input
              type="text"
              value={editableUserName}
              onChange={(e) => setEditableUserName(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <span>{user.username}</span>
          )}
        </td>
        <td className="px-4 py-2">
          {editableUserId === user._id ? (
            <input
              type="email"
              value={editableUserEmail}
              onChange={(e) => setEditableUserEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <a href={`mailto:${user.email}`}>{user.email}</a>
          )}
        </td>
        <td className="px-4 py-2">
          {user.isAdmin ? (
            <FaCheck className="text-green-500" />
          ) : (
            <FaTimes className="text-red-500" />
          )}
        </td>
        <td className="px-4 py-2 flex items-center">
          {editableUserId === user._id ? (
            <>
              <Button onClick={() => updateHandler(user._id)}>
                <FaCheck className="text-green-500" />
              </Button>
              <Button onClick={() => setEditableUserId(null)}>
                <FaTimes className="text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Button className="text-blue-600 px-2" onClick={() => toggleEdit(user._id, user.username, user.email)}>
                <FaEdit />
              </Button>
              <Button className="text-red-600" onClick={() => deleteHandler(user._id)}>
                <FaTrash />
              </Button>
            </>
          )}
        </td>
      </tr>
    ))}
  </tbody>
          </table>
              </div>
              </div>
      )}
    </div>



  );
};

export default UserList;
