
import { useTranslation } from "react-i18next";

import {
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { Link } from "react-router-dom";


const Category = () => {
  const { data: categories } = useFetchCategoriesQuery();


  const { t } = useTranslation();


  return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-3 py-12 border-b-2 border-green-700">
  {categories?.map((category) => (
    <Link to="/shop" key={category._id} className="text-center border shadow-sm rounded-lg p-4 hover:bg-green-200 transition-colors duration-200">
      <div className="mb-2">{/* Icon component here */}</div>
      <h2 className="text-lg font-semibold">{category.name}</h2>
    </Link>
  ))}
          <div id="custum-border"></div>
</div>

  );
};

export default Category;
