/* eslint-disable consistent-return */
import { Document } from '@prismicio/client/types/documents';
import Prismic from '@prismicio/client';

const apiEndpoint = process.env.PRISMIC_API_ENDPOINT;
const apiToken = process.env.PRISMIC_ACCESS_TOKEN;

function linkResolver(doc: Document): string {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

const prismicClient = Prismic.client(apiEndpoint, { accessToken: apiToken });

const Preview = async (req, res) => {
  const { token: ref, documentId } = req.query;

  const redirectUrl = await prismicClient
    .getPreviewResolver(ref, documentId)
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });
  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
    <script>window.location.href = '${redirectUrl}'</script>
    </head>`
  );
  res.end();
};

export default Preview;
