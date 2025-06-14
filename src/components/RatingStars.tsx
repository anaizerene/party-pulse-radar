
import { Star, StarHalf, StarOff } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
}

const RatingStars = ({ rating, max = 5 }: RatingStarsProps) => {
  const stars = [];
  let v = rating;

  for (let i = 0; i < max; i++) {
    if (v >= 1) {
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 inline" fill="#facc15" />);
      v -= 1;
    } else if (v > 0.35) {
      stars.push(<StarHalf key={i} className="w-5 h-5 text-yellow-400 inline" fill="#facc15" />);
      v = 0;
    } else {
      stars.push(<StarOff key={i} className="w-5 h-5 text-gray-300/90 inline" />);
    }
  }
  return <span className="align-middle">{stars}</span>;
};

export default RatingStars;
