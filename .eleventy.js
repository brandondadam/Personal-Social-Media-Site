require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("relativeDate", (dateVal) => {
    const date = new Date(dateVal);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "1d";
    if (diffDays < 30) return `${diffDays}d`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}mo`;
    return `${Math.floor(diffMonths / 12)}y`;
  });

  eleventyConfig.addFilter("readableDate", (dateVal) => {
    return new Date(dateVal).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("shortDate", (dateVal) => {
    return new Date(dateVal).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("reject", (arr, attr, value) => {
    return (arr || []).filter(item => item !== value);
  });

  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
