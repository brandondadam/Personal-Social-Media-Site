module.exports = class {
  data() {
    return {
      permalink: '/search.json',
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections, noteworthy }) {
    const posts = (collections.posts || []).map(post => ({
      type: 'post',
      title: post.data.title || '',
      excerpt: post.data.excerpt || '',
      category: post.data.category || '',
      url: post.url,
    }));

    const items = (noteworthy || []).map(item => ({
      type: 'noteworthy',
      name: item.name,
      href: item.href,
      domain: item.domain,
      faviconDomain: item.faviconDomain,
      tag: item.tag,
    }));

    return JSON.stringify([...posts, ...items]);
  }
};
