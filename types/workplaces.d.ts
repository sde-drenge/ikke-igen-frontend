interface Workplace {
  uuid: string;
  name: string;
  vat: string;
  website: string;
  stars: string;
  amountOfReviews: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkplacePagination extends Pagination {
  results: Workplace[];
}
