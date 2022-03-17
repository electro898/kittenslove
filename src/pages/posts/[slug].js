import { categoryPathBySlug } from 'lib/categories';

export async function getStaticProps({ params = {} } = {}) {
  const { post } = await getPostBySlug(params?.slug);

  const socialImage = `${process.env.OG_IMAGE_DIRECTORY}/${params?.slug}.png`;

  const { categories, databaseId: postId } = post;

  const { category: relatedCategory, posts: relatedPosts } = await getRelatedPosts(categories, postId);
  const hasRelated = relatedCategory && Array.isArray(relatedPosts) && relatedPosts.length;
  const related = !hasRelated
    ? null
    : {
        posts: relatedPosts,
        title: {
          name: relatedCategory.name || null,
          link: categoryPathBySlug(relatedCategory.slug),
        },
      };

  return {
    props: {
      post,
      socialImage,
      related,
    },
  };
}

export async function getStaticPaths() {
  const { posts } = await getAllPosts({
    queryIncludes: 'index',
  });

  const paths = posts
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));

  return {
    paths,
    fallback: false,
  };
}
