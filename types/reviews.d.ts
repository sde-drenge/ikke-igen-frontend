interface Review {
  uuid: string;
  stars: string;
  title: string;
  comment: string;
  author: LightUser;
  workplace: Workplace;
  verifiedBy: User["uuid"] | null;
  createdAt: string;
  updatedAt: string;
}

interface ReviewPagination extends Pagination {
  results: Review[];
}
