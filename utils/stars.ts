export const starColors = (
  stars: number
): {
  star: string;
  background: string;
} => {
  if (stars >= 4) {
    return { star: "#44DF72", background: "#B9F8CF" };
  }

  if (stars >= 3) {
    return { star: "#FCC800", background: "#FEF086" };
  }

  if (stars >= 2) {
    return { star: "#F98908", background: "#FCD6A8" };
  }

  if (stars >= 1) {
    return { star: "#F86467", background: "#FCC9C9" };
  }

  return { star: "#99A1AF", background: "#E5E8EB" };
};
