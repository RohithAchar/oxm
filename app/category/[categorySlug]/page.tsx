type Props = {
  params: Promise<{
    categorySlug: string;
  }>;
};

const CategoryPage = async ({ params }: Props) => {
  const { categorySlug } = await params;
  return <div>Category: {categorySlug}</div>;
};

export default CategoryPage;
