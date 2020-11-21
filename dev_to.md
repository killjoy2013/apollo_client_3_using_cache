# Introduction

In a previous article we had created an app using Apollo Client 2.6 to persist our form data [previous article using Apollo Client 2.6](https://dev.to/muratas/react-form-state-persistency-useformikcontext-apollo-client-graphql-code-generator-typescript-2def)

In this article we'll discover Apollo Client 3 for even more complicated senarios. We'll be using Gatsbyjs instead of famous Create React App starter project.

You can test the working app [demo](https://codesandbox.io/s/zealous-sea-sc1qt) or go through [Github project](https://github.com/killjoy2013/gatsbyjs_apollo_client_graphql_codegen)

Let's start...

### Why do we use Gatsbyjs when we already have Create React App (CRA)

CRA is a super Reactjs starter. It saves you from many possible trouble caused by especially packaging and building. You can develop a basic app in just minutes. For educational or POC purposes it's an ideal choice. Say, you developed a library in Github and want the users to be able to test it once they cloned it. You can just add a demo CRA app to your Github project to test your library.

However, real life projects frequently call for more features which are beyond the scope of CRA. Performance may be the first one.

### Dynamic app vs static app

CRA creates a dynamic app which lives in the browser. DOM object is rendered in the browser after the necessary artifacts, CSS, javascript, fonts etc... are loaded. Since DOM is notorious enough for its poor mutation performance, rendering client side obviously is not the perfect choice when high render performance is expected. Gatsbyjs on the other hand, is a static site genetation tool (SSG). We have our pages already compiled and ready to be displayed (dehydrated) on the server. React uses shadow DOM to match up the existing content with what the application renders. This process avoids expensive and unnecessary DOM manipulations (hydration). This is what lies beneath blazingly fast React web pages. Gatsby provides this feature out of the box.

### Landing page

In CRA, when you browse to a route, all the app is loaded initially, then client side route happens. That's why the initial page load in CRA can be slow. When you need to create a landing page, you don't need to load all the app just to display one page, for a landing page it's important to show up ASAP. Gatsbtjs shines here. Since a Gatsby app is composed of pre-build, ready-to-render pages, you can create lightning fast landing pages.

### Search Engine Optimization

Since Gatsby sites are server-side rendered, all the page contents are available to search engine crawlers. If SEO matters to you, CRA is not for you.

### Microfrontends

This item was my reason to go into detail of Gatsby, so it's crucial to me. CRA is not created to construct a microfrontend architecture. To create a microfrontend structure with CRA, you need to eject it and find your own way!
On the other hand, Gatsby is very suitable fot this purpose. You can add your dynamic apps, say a CRA app, to your Gatsby app. So, in addition to your static routes, you can host your dynamic, client-side routing apps like `/app1/`, `/app2/` as well.

## Let's start

First we need to install gatsby-cli;

```
npm i -g gatsby-cli
```

There are many Gatsby starters for various purposes. For this article I started with [hello world Gatsby starter](https://github.com/gatsbyjs/gatsby-starter-hello-world)

```
gatsby new gatsbyjs_apollo_client_graphql_codegen https://github.com/gatsbyjs/gatsby-starter-hello-world
```

### Adding typescript

There are three steps for this;

- Adding `tsconfig.json` file
- Adding `gatsby-plugin-typescript` to `gatsby-config.js`

  ![gatsby-config.js](https://dev-to-uploads.s3.amazonaws.com/i/o6pcts9gvv67754mmmsr.PNG)

- Install `gatsby-plugin-typescript`

![package_json](https://dev-to-uploads.s3.amazonaws.com/i/0eyj4ugsij762dyj8ixc.PNG)

Finally, change the extensions of the pages created by Gatsby to `.tsx`

### Using images in Gatsby

Gatsby makes use of Graphql extensively. You access all the static assets using Graphql. This paradigm makes really great sense if you already using Graphql. In this project we add our home page image accordingly;

`src\components\image.tsx`

```jsx
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "gate.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            base64
            aspectRatio
            sizes
            src
            srcSet
            originalImg
            originalName
          }
        }
      }
    }
  `);

  if (!data?.placeholderImage?.childImageSharp?.fluid) {
    return <div>Picture not found</div>;
  }

  return <Img fluid={data.placeholderImage.childImageSharp.fluid} />;
};

export default Image;
```

Here we use `gatsby-image` for optimized images in lazy loading. `useStaticQuery` is used from `gatsby` to query static resources in build time.

![image_folder](https://dev-to-uploads.s3.amazonaws.com/i/1ctqdtukhszv7nm21536.PNG)

What's really awesome, you can use famous `GraphiQL` out of the box to test and create these static queries. After you `npm start` your project, just navigate to `http://localhost:8000/___graphql` and run our image query like this;

![graphiql](https://dev-to-uploads.s3.amazonaws.com/i/08sjnq56merjoa3jpahb.PNG)

## How about dynamic data?

OK, Gatsby is great with static pages. But what if we need dynamic data? Is it only meant to be used with such static content? For a perfect answer to this question, you can watch [Jason Lengstorf](https://www.youtube.com/watch?v=wNUg1jpj9T0&list=WL&index=7&t=1305s) talking about **beyond static with Gatsby**.

We can easily make use of `Apollo Client` here. All we need to do is to create an `Apollo Provider` and pass it down from the very root of our component tree...

## Entering Apollo Client realm

We have a wonderful friend, [graphql code generator](https://graphql-code-generator.com/). We install its packages as dev dependencies first;

```js
    "@graphql-codegen/add": "^2.0.1",
    "@graphql-codegen/cli": "^1.17.10",
    "@graphql-codegen/typescript": "^1.17.10",
    "@graphql-codegen/typescript-operations": "^1.17.8",
    "@graphql-codegen/typescript-react-apollo": "^2.0.7",
    "@graphql-codegen/typescript-resolvers": "^1.17.10"
```

It generates our types using graphql schema saving us from creating ,sometimes hundreds of, models manually and provides perfectly typed structure. First we create `codegen.yml`. We declare schema URL, our queries file and let codegen know which file it's supposed to generate types into. Also codegen will generate query hooks and use typescript.

`client-schema.graphql`

```ts
type Car {
  brand: String
  model: String
  year: String
  fastEnough: Boolean!
}

type City {
  name: String
  country: String
  population: Int
}

extend type Country{
  selected: Boolean
}

type SelectedCountryType{
  code: String
  name: String
  capital: String
}
```

`codegen.yml`

```yaml
schema: https://countries.trevorblades.com/
documents:
  - ./apollo/queries.ts
overwrite: true
generates:
  ./graphql/types.tsx:
    schema: client-schema.graphql
    plugins:
      - add:
          content: '/* eslint-disable */'
      - typescript
      - typescript-operations
      - typescript-react-apollo
      - typescript-resolvers
    config:
      withHOC: false
      withHooks: true
      withComponent: false
      useIndexSignature: true
```

Our `queries.ts` file includes Countries query;

```js
import gql from 'graphql-tag';
const QUERY_COUNTRIES = gql`
  query countries($arg: CountryFilterInput) {
    countries(filter: $arg) {
      code
      name
      emoji
    }
  }
`;
export const Queries = {
  QUERY_COUNTRIES,
};
```

We need to add `"codegen": "gql-gen"` to scripts section in `package.json`. When we run `npm run codegen`, `graphql\types.tsx` file is supposed to be created now.

## Apollo Client 3

Apollo Client 3 has breaking changes. Now we need to install only one package;

`"@apollo/client": "^3.2.5"`

and create a cache.ts file;

`apollo\cache.ts`

```ts
import { InMemoryCache } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({});
```

Let's create Apollo Client

`apollo\ApolloProxy.ts`

```ts
import { ApolloClient, ApolloLink, createHttpLink } from '@apollo/client';
import fetch from 'isomorphic-fetch';
import { cache } from './cache';

const httpLink = createHttpLink({
  uri: 'https://countries.trevorblades.com/',
  fetch,
});
const link = ApolloLink.from([httpLink]);

export const client = new ApolloClient({
  link,
  cache,
});
```

Now we need to create and pass down the `ApolloProvider`

`apollo\wrap-root-element.tsx`

```tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './ApolloProxy';

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);
```

`gatsby-browser.js`

```js
export { wrapRootElement } from './apollo/wrap-root-element';
```

We're know ready to use Apollo Client 3 features. Let's create some pages to show off. We'll create `header.tsx` and `layout.tsx` components for our simple layout;

`src\components\header.tsx`

```tsx
import {
  AppBar,
  createStyles,
  makeStyles,
  Theme,
  Toolbar,
} from '@material-ui/core';
import { Link } from 'gatsby';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    href: {
      margin: 20,
      color: 'white',
    },
    appBar: {
      width: '100%',
    },
  });
});

const Header = () => {
  const classes = useStyles({});
  return (
    <AppBar position="static">
      <Toolbar>
        <Link className={classes.href} to="/">
          Home
        </Link>
        <Link className={classes.href} to="/cars">
          Cars
        </Link>
        <Link className={classes.href} to="/cities">
          Cities
        </Link>
        <Link className={classes.href} to="/countries">
          Countries
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
```

`src\components\layout.tsx`

```tsx
import React from 'react';
import Header from './header';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}>
        <main>{children}</main>
        <footer
          style={{
            marginTop: `2rem`,
          }}>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </footer>
      </div>
    </>
  );
};

export default Layout;
```

Our index (home), cars, cities & countries pages;

`src\pages\index.tsx`

```jsx
import React from 'react';
import Image from '../components/image';
import Layout from '../components/layout';
import './index.css';

export default function Home() {
  return (
    <Layout>
      <h1>Hi people</h1>
      <p>This is Gatsby & Graphql Code Generator & Apollo Client 3</p>

      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </Layout>
  );
}
```

`src\pages\cars.tsx`

```

```
