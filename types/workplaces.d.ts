interface Workplace {
  uuid: string;
  name: string;
  vat: string;
  address: string;
  stars: string;
  starsProcentages: {
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
  }
  amountOfReviews: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkplacePagination extends Pagination {
  results: Workplace[];
}

interface TopCategory {
  uuid: string;
  name: string;
  color: string;
  categories: Category[];
}

interface Category {
  uuid: string;
  name: string;
}
