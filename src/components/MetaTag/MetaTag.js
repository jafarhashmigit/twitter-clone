import Head from "next/head";

const Meta = ({ title, description, image  }) => (
  <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    <title>{title}</title>
    <meta name="description" content={description} />

    {/* Open Graph meta tags */}
    <meta property="og:title" content={title} />
    <meta property="og:type" content="article" />
    <meta
      property="og:image"
      content={image ?? "https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"}
    />
    <meta
      property="og:description"
      content={description}
    />
    <meta property="og:site_name" content="Twitter" />
    <meta property="og:locale" content="en_US" />

    {/* Twitter Card meta tags  */}
    <meta name="twitter:card" content={image ?? "https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"} />
    <meta name="twitter:title" content={title} />
    <meta
      name="twitter:description"
      content={description}
    />
    <meta
      name="twitter:image"
      content={image ?? "https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"}
    />
    <meta name="twitter:site" content="@yourhandle" />
    <meta name="twitter:creator" content="@yourhandle" />

    {/* Schema.org meta tags */}
    <meta itemProp="name" content={title} />
    <meta itemProp="description" content={description} />
    <meta
      itemProp="image"
      content={image ?? "https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"}
    />
  </Head>
);

export default Meta;
