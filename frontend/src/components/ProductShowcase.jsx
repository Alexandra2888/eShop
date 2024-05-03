import { Link } from "react-router-dom";

import Button from "../components/Button";

const ProductShowcase = () => {
  return (
    <div className="flex flex-wrap justify-center items-center py-12 mx-12 md:px-48 md:py-24">
      <div className="flex flex-wrap items-center rounded-lg bg-[#FFD1AC] bg-opacity-30 p-6 shadow-lg">
        <div className="flex-1 min-w-0 md:px-24">
          <img src="https://i.redd.it/qrrpwbko0ag81.jpg" alt="Ipad Air Gen 5" className="h-auto w-full rounded-lg" />
        </div>
        <div className="flex-1 px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ipad Air Gen 5</h2>
          <p className="text-gray-500">Lorem ipsum dolor sit amet consectetur. Integer cursus cursus in sapien quam risus sed diam.</p>
          <div className="my-2 space-x-2 space-y-4 md:space-x-0 md:space-y-0 flex flex-col md:flex-row">
            <Button className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
             <Link to="/shop"> Buy $900</Link>
            </Button>
            <Button className="bg-transparent  text-green-700 border border-green-500 py-2 px-4 rounded">
              <Link to="/shop">View Detail</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
