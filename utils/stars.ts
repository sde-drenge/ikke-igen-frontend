export const starColors = (
  stars: number
): {
  star: string;
  background: string;
} => {
  if (stars >= 4) {
    return { star: "bg-green-400!", background: "bg-green-200" };
  }

  if (stars >= 3) {
    return { star: "bg-yellow-400!", background: "bg-yellow-200" };
  }

  if (stars >= 2) {
    return { star: "bg-orange-400!", background: "bg-orange-200" };
  }

  if (stars >= 1) {
    return { star: "bg-red-400!", background: "bg-red-200" };
  }

  return { star: "bg-gray-400!", background: "bg-gray-200" };
};
