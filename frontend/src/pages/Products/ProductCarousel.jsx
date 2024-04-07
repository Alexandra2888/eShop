import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import { FaBox, FaStar, FaStore } from "react-icons/fa";

import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";

import Message from "../../components/Message";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const { t } = useTranslation();

  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mb-4 md:ml-[10rem] max-w-screen-lg">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="my-24 max-w-sm md:max-w-full">
            <h3 className="text-xl font-semibold text-center my-8">
              Featured products
            </h3>
            <Slider {...settings} className="">
              {products.map(
                ({
                  image,
                  _id,
                  name,
                  price,

                  brand,

                  numReviews,
                  rating,
                }) => (
                  <div
                    key={_id}
                    className="flex flex-col items-center space-y-4 p-4"
                  >
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-64 object-cover md:h-72 lg:h-80 xl:h-96"
                    />
                    <div className="text-center space-y-2">
                      <h2 className="text-lg font-bold">{name}</h2>
                      <p className="text-gray-500">$ {price}</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <h1 className="flex items-center">
                          <FaStore className="mr-1 text-blue-900" /> {brand}
                        </h1>
                      </div>
                      <div className="flex items-center justify-between">
                        <h1 className="flex items-center">
                          <FaStar className="mr-1 text-yellow-300" /> {numReviews}{" "}
                          Reviews
                        </h1>
                        <h1 className="flex items-center">
                          <FaBox className="mr-1 text-blue-900" /> {rating}{" "}
                          Rating
                        </h1>
                      </div>
                    </div>
                  </div>
                )
              )}
            </Slider>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;
