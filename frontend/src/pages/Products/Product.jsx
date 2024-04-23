import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <section className="flex flex-col md:w-[20rem] md:ml-[5rem] p-3 relative">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className=" w-[15rem] md:w-[20rem] rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg">{product.name}</div>
            <span className="bg-white text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-600 dark:text-white">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </section>
  );
};

export default Product;
