interface Workplace {
  uuid: string;
  name: string;
  vat: string;
  address: string;
  stars: string;
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
