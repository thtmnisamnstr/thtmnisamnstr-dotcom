module.exports = {
  siteMetadata: {
    title: `thtmnisamnstr`,
    name: `thtmnisamnstr`,
    siteUrl: `https://thtmnisamnstr.com/`,
    description: `Gavin Johnson's personal site. Resume, blog posts, tech product marketing stuff, maybe some tech-y stuff too.`,
    hero: {
      heading: `Hi. I'm Gavin. You can find me floating around the internet as thtmnisamnstr. This is my site.`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/gavinjtech`,
      },
      {
        name: `devto`,
        url: `https://dev.to/thtmnisamnstr`,
      },
      {
        name: `github`,
        url: `https://github.com/thtmnisamnstr`,
      },
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/gavin-johnson/`,
      },
      {
        name: `instagram`,
        url: `https://www.instagram.com/thtmnisamnstr`,
      },
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        sources: {
          local: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
      },
    },
  ],
};
