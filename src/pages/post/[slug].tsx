/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import Header from '../../components/Header';
import Comments from '../../components/Comments';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    subtitle: string;
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const minutes = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(' ').length;

    const words = contentItem.body.map(item => item.text.split(' ').length);
    words.map(word => (total += word));
    return total;
  }, 0);
  const timeToRead = Math.ceil(minutes / 200);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const lastDate = post.last_publication_date;

  const isPostEdited = () => {
    const postEdited = post.first_publication_date !== lastDate;
    if (postEdited) {
      const editionDate = format(
        new Date(lastDate),
        "'editado em' dd MMM yyyy",
        {
          locale: ptBR,
        }
      );
      return editionDate;
    }
    return ' ';
  };

  return (
    <div className={commonStyles.container}>
      <Header />
      <img src={post.data.banner.url} alt="banner" className={styles.Image} />
      <div className={styles.container}>
        <strong>{post.data.title}</strong>
        <div className={styles.subtitle}>
          <div>
            <FiCalendar />
            <time>
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
          </div>
          <div>
            <FiUser />
            <span>{post.data.author}</span>
          </div>
          <div>
            <FiClock />
            <span>{`${timeToRead} min`}</span>
          </div>
        </div>
        <span>{isPostEdited()}</span>
      </div>
      {post.data.content.map(content => {
        return (
          <article key={content.heading} className={styles.post}>
            <h2>{content.heading}</h2>
            <div
              className={styles.postContent}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />
          </article>
        );
      })}
      <Comments />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.uid'],
      pageSize: 100,
    }
  );
  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
  };
};
