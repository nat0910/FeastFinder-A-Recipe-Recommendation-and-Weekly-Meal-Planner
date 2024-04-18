import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => (
  <div
    className="flex-none flex flex-col items-center justify-center bg-white rounded-lg shadow 
                  p-2 border border-gray-300 w-[7rem] sm:w-[8rem] md:w-[9rem] lg:w-[10rem] h-34"
  >
    <Link to={`/category/${category.name}`}>
      {/* Flex-none prevents the card from stretching. w-[7rem] sets a fixed width that grows on larger screens */}
      <div className="flex justify-center items-center mb-1 w-full h-14">
        {/* Use w-full to allow image to use the full width of the card while maintaining its aspect ratio */}
        <img
          src={category.icon}
          alt={category.name}
          className="object-contain max-w-full max-h-full"
        />
      </div>
      <span className="text-center text-xs sm:text-sm font-normal truncate w-full px-1">
        {category.name}
      </span>
    </Link>
  </div>
);

export default CategoryCard;
