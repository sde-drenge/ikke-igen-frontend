interface School {
  uuid: string;
  name: string;
  address: string;
  createdAt: string;
}

interface SchoolPagination extends Pagination {
  results: School[];
}
