import { useState, useEffect } from "react";

const TopBtn = () => {
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);

  const checkScrollHeight = () => {
    if (window.scrollY > 150) {
      setIsScrollButtonVisible(true);
    } else {
      setIsScrollButtonVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollHeight);
    return () => {
      window.removeEventListener("scroll", checkScrollHeight);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-8 right-8 items-center h-10 w-10 justify-center z-40 cursor-pointer bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 rounded-full transition-transform duration-300 scale-100 hover:scale-110 ${
        isScrollButtonVisible ? "flex" : "hidden"
      }`}
      onClick={scrollToTop}
    >
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#131212"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </div>
  );
};

export default TopBtn;
