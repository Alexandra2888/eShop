import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { useTranslation } from "react-i18next";
// import { getImageUrlHardcoded } from "../utils/imageUtils";

const SmallProduct = ({ product }) => {
  const { t } = useTranslation();

  // Temporary function to construct image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://eshop-backend-iq47.onrender.com${imagePath}`;
  };

  return (
    <div className="w-[20rem] h-[26rem] ml-[2rem] flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-3/5 w-full overflow-hidden">
        <img src={getImageUrl(product.image)} alt={product.name} className="w-16 h-16 object-cover rounded" />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-4 h-2/5 flex flex-col justify-between">
        <Link to={`/product/${product._id}`} className="mb-2">
          <h2 className="text-center py-3 text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors">
            {product.name}
          </h2>
        </Link>
        <div className="flex justify-between items-end mt-4">
          <span className="text-sm font-medium text-gray-800">
            {t("price")}:
          </span>
          <span className="text-lg font-semibold text-gray-900">
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
