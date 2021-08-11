/* eslint-disable consistent-return */
import Prismic from '@prismicio/client';
import { Document } from '@prismicio/client/types/documents';
import { DefaultClient } from '@prismicio/client/types/client';

function linkResolver(doc: Document): string {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

const Preview = async (req, res) => {
  const { token: ref, documentId } = req.query;
  const redirectUrl = await Prismic.client(req)
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
