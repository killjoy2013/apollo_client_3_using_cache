# Introduction

In a previous article we had created an app using Apollo Client 2.6 to persist our form data [previous article using Apollo Client 2.6](https://dev.to/muratas/react-form-state-persistency-useformikcontext-apollo-client-graphql-code-generator-typescript-2def)

In this article we'll discover Apollo Client 3 for even more complicated senarios. We'll be using Gatsby instead of famous Create React App starter project.

You can test the working app [demo](https://codesandbox.io/s/zealous-sea-sc1qt) or go through [Github project](https://github.com/killjoy2013/gatsbyjs_apollo_client_graphql_codegen)

Let's start...

### Why do we use Gatsby when we already have Create React App (CRA)

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
On the other hand, Gatsby is very suitable for this purpose. You can add your dynamic apps, say a CRA app, to your Gatsby app. So, in addition to your static routes, you can host your dynamic, client-side routing apps like `/app1/`, `/app2/` as well.

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

Gatsby makes use of Graphql extensively. You access all the static assets using Graphql. This paradigm makes really great sense if you already using Graphql. In this project we add our home page image accordingly.

Below npm packages must be installed;

```json
    "gatsby-image": "^2.4.21",
    "gatsby-plugin-sharp": "^2.6.43",
    "gatsby-source-filesystem": "^2.3.35",
    "gatsby-transformer-sharp": "^2.5.20",
```

And `gatsby-config.js` is configured with these plugins. Order of the plugins is important.

```jsx
const path = require(`path`);

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    'gatsby-plugin-typescript',
  ],
};
```

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

## Apollo Client 3 (AC 3)

Apollo Client 3 has breaking changes. Now we need to install only one package;

`"@apollo/client": "^3.2.5"`

AC 3 has a very important change, no more client resolvers! Creating resolvers was really cumbersome and to me, it's very reasonable to remove it in this new paradigm.
What we need is to create the cache instantiating `InMemoryCache`. A lot of new things happening here. A completely saperate article can be dedicated to using cache in AC 3. Let's talk about our usage here.

## Reactive Variables

This is a mechanism to store local state data. They are not (yet) inside Apollo Client cache. We can store any kind of data with them. One big advantage they bring is, we don't need to write queries to manuplate our local data! Really a big positive mind shift.Any update on them triggers an update on the query that uses it. You can control whether or not to trigger rendering, we'll be going into this.

## Type Policies

We can customize our types using `@client` directive as you may know. Here we have a `Country` type and we need to add a `selected` property to it. This property is not (and should not be) in the original `Country` type definition. We need such a property only for our client side select / deselect operation. In AC 2, we needed to create a resolver to query countries with `selected` property. In AC 3, we just create a type policy on `Country` type. We just created a `selected` field under `fields` making use of `selectedCountryVar` reactive variable. Any update on this reactive variable will trigger update of our `useCountriesLazyQuery` hook and the query result will include updated `selected` data depending on `code` value. Much cleaner than using resolvers.

Another new entity in the type policy is `keyFields`. We just talked about the usage of `selected` property. Now we want to remove the selected country. In AC 2, we could have done this by using `cache.WriteData`. In my app, there was an extensive usage of `cache.WriteData`. Unfortunately, in AC 3 there's no `cache.WriteData`! Not a big problem, we can just update them with `cache.ReadQuery` and `cache.WriteQuery`. AC 3 offers more; `cache.evict`. We need to set the `keyFields` to use them later to remove this cache entry by evicting it.

`apollo\cache.ts`

```ts
import { InMemoryCache, makeVar } from '@apollo/client';
import { Car, City, Country, SelectedCountryType } from '../graphql/types';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Country: {
      keyFields: ['code'],
      fields: {
        selected: (_, { readField }) => {
          const code = readField('code');
          return code === selectedCountryVar().code;
        },
      },
    },
    Query: {
      fields: {
        countries: {
          merge: (existing, incoming) => {
            return incoming;
          },
        },
      },
    },
  },
});

export const codeVar = makeVar<string>('');

export function makeSelectedCountryType(
  partial: Partial<SelectedCountryType>
): SelectedCountryType {
  return {
    code: '',
    name: '',
    capital: '',
    ...partial,
  };
}

export const selectedCountryVar = makeVar<SelectedCountryType>(
  makeSelectedCountryType({})
);

export const carFormVar = makeVar<Car>({
  brand: '',
  model: '',
  year: '',
  fastEnough: false,
});

export const cityFormVar = makeVar<City>({
  name: '',
  country: '',
  population: undefined,
});
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

We need to somehow let Gatsby use this `wrap-root-element.tsx` to wrap the whole app tree. That's where we use `gatsby-browser.js`

`gatsby-browser.js`

```js
export { wrapRootElement } from './apollo/wrap-root-element';
```

We're now ready to create our pages making use of these AC 3 features. Let's create some pages to show off. We'll create `header.tsx` and `layout.tsx` components for our simple layout;

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

Our first functional page is `cars.tsx`. Here we have a basic Formik form and want to persist that form data to AC 3 cache when we click `persist cars` button.

```jsx
onClick={() => carFormVar(formik.values)}
```

We use `carFormVar` reactive variable as Formik initial value. `carFormVar` is already created with the initial field values in `cache.ts`. Altough there's nothing fancy here, updating directly reactive variable without dealing with query syntax is important. If go to a different route other than `cars` page and route back, you'll find your form expectedly filled with your data;

`src\pages\cars.tsx`

```tsx
import {
  Button,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import { Formik, useFormikContext } from 'formik';
import * as React from 'react';
import { Car } from '../../graphql/types';
import DisplayFormikState from '../components/DisplayFormikState';
import { carFormVar } from '../../apollo/cache';
import { RouteComponentProps } from '@reach/router';
import Layout from '../components/layout';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      width: 250,
    },
    input: {
      width: 250,
    },
    formControl: {
      width: 250,
    },
    visible: {
      visibility: 'visible',
    },
    hidden: {
      visibility: 'hidden',
    },
    paper: {
      width: '100%',
      margin: '20px 0px 0px 0px',
      padding: 20,
    },
  })
);

interface CarFormProps {}

const CarForm: React.FunctionComponent<CarFormProps> = (
  props: CarFormProps
) => {
  const classes = useStyles(props);
  const formik = useFormikContext<Car>();

  const submitCountClassName = clsx({
    [classes.visible]: formik.submitCount > 0,
    [classes.hidden]: formik.submitCount === 0,
  });

  return (
    <form>
      <Paper variant="outlined" className={classes.paper}>
        <Grid container direction="column" justify="center" alignItems="center">
          <TextField
            className={classes.input}
            name="brand"
            label="Brand"
            value={formik.values.brand}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
          />

          <TextField
            className={classes.input}
            name="model"
            label="Model"
            value={formik.values.model}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
          />

          <FormControl
            margin="normal"
            variant="outlined"
            className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={formik.values.year}
              onChange={(e) => {
                formik.setFieldValue('year', e.target.value);
              }}
              labelWidth={30}>
              <MenuItem value={''}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={'2017'}>2017</MenuItem>
              <MenuItem value={'2018'}>2018</MenuItem>
              <MenuItem value={'2019'}>2019</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                name="fastEnough"
                checked={formik.values.fastEnough}
                value="fastEnough"
                onChange={(e) => {
                  formik.setFieldValue('fastEnough', e.target.checked);
                }}
              />
            }
            label="Fast Enough"></FormControlLabel>

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => carFormVar(formik.values)}>
            Persist Cars
          </Button>
          <Typography
            className={submitCountClassName}
            variant="subtitle1"
            color="textSecondary">
            {`Car form is persisted ${formik.submitCount}. time`}
          </Typography>
          <DisplayFormikState {...formik.values} />
        </Grid>
      </Paper>
    </form>
  );
};

interface ICars extends RouteComponentProps {}

const Cars: React.FunctionComponent<ICars> = (props: ICars) => {
  return (
    <Layout>
      <Formik initialValues={carFormVar()} onSubmit={(values) => {}}>
        <CarForm />
      </Formik>
    </Layout>
  );
};

export default Cars;
```

Our second page is `cities`. It's again a Formik form. However, use case is different. Normally, Formik state is meant to be ephemeral and is to be persisted deliberately. Our cars page was build just like that. If you ever tried to keep your form state on, for instance, React Context, and update it on each field's onChange handler you've probably seen that it causes undesired renders and that's why Formik documentaion points that the form state should be kept ephemeral.
Using reactive variables in AC 3, we can do better. We created `cityFormVar` in our cache with the initial values again. Fields' change handler is;

```jsx
const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  formik.handleChange(event);
  cityFormVar({ ...cityFormVar(), [event.target.name]: event.target.value });
};
```

After updating Formik state, we update `cityFormVar` at the same time.

Let's navigate to cities page and update some fields. As you see, on each key stroke, only Formik renders, which is a usual Formik behavior. Cities page is not rendered unnecessarily. If you navigate to a different page and come back, you'll find your form filled with your data.

![cities_form](https://dev-to-uploads.s3.amazonaws.com/i/cb4sej6fqbpom4a9mqz4.PNG)

We use `cityFormVar` reactive variable as Formik initial data as below. Updating `cityFormVar` don't force the page render. Which is our desired behaviour.

```jsx
<Formik initialValues={cityFormVar()} onSubmit={(values) => {}}>
```

If we use it as below, cities page would rerender in every update of `cityFormVar`. So, reactive variables let us control the rendering...

```jsx
const cityForm = useReactiveVar(cityFormVar);
.
.
.
<Formik initialValues={cityForm} onSubmit={(values) => {}}>
```

`src\pages\cities.tsx`

```tsx
import * as React from 'react';
import { Formik, useFormikContext } from 'formik';
import TextField from '@material-ui/core/TextField';
import {
  Grid,
  Button,
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Paper,
} from '@material-ui/core';
import DisplayFormikState from '../components/DisplayFormikState';
import { City } from '../../graphql/types';
import clsx from 'clsx';
import { cityFormVar } from '../../apollo/cache';
import { RouteComponentProps } from '@reach/router';
import Layout from '../components/layout';
import useRenderCount from '@hooks/render-count';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      width: 250,
    },
    input: {
      width: 250,
    },
    visible: {
      visibility: 'visible',
    },
    hidden: {
      visibility: 'hidden',
    },
    paper: {
      width: '100%',
      margin: '20px 0px 0px 0px',
      padding: 20,
    },
  })
);

interface CityFormProps {}
const CityForm = (props: CityFormProps) => {
  const classes = useStyles(props);
  const renderCount = useRenderCount();
  const formik = useFormikContext<City>();
  const submitCountClassName = clsx({
    [classes.visible]: formik.submitCount > 0,
    [classes.hidden]: formik.submitCount === 0,
  });

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event);
    cityFormVar({ ...cityFormVar(), [event.target.name]: event.target.value });
  };

  return (
    <form>
      <Paper variant="outlined" className={classes.paper}>
        <Grid container direction="column" justify="center" alignItems="center">
          <TextField
            className={classes.input}
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={changeHandler}
            variant="outlined"
            margin="normal"
          />

          <TextField
            className={classes.input}
            name="country"
            label="Country"
            value={formik.values.country}
            onChange={changeHandler}
            variant="outlined"
            margin="normal"
          />

          <TextField
            className={classes.input}
            name="population"
            label="Population"
            value={formik.values.population}
            onChange={changeHandler}
            variant="outlined"
            margin="normal"
          />

          <DisplayFormikState {...formik.values} />
          <Typography>Render count : {renderCount}</Typography>
        </Grid>
      </Paper>
    </form>
  );
};

interface ICities extends RouteComponentProps {}

const Cities: React.FunctionComponent<ICities> = (props: ICities) => {
  const renderCount = useRenderCount();

  return (
    <Layout>
      <Formik initialValues={cityFormVar()} onSubmit={(values) => {}}>
        <CityForm />
      </Formik>
      <Typography>Render count : {renderCount}</Typography>
    </Layout>
  );
};

export default Cities;
```

Our third page is `Countries`. Here is the use case;

- When the page initially renders, query countries and display.

  We use `useCountriesLazyQuery` hook which `graphql code generator` has already generated.

  ![countries](https://dev-to-uploads.s3.amazonaws.com/i/7vhy2jlfra6r2lmz5ywm.PNG)

  Top part is again a simple Formik form using only `codeVar` reactive variable. Initially set to empty string in the `cache.ts`.
  To query the countries, we use an api [https://countries.trevorblades.com/](https://countries.trevorblades.com/) You can check it out and create different queries.
  We defined our `countries` query in `queries.ts` and use this file in `codegen.yml`. After the very first render we run the query handler which uses lazy query hook;

  ```jsx
  useEffect(() => {
    queryHandler(codeVar());
  }, []);
  ```

  Result data is displayed using Material-UI table.

- We can re-query countries depending on the two charactes entered as `code` parameter.

  We update the `codeVar` in the textbox's change handler. So, we can run the query for different country codes.

- We can select any country with a checkbox

  First cell of each row of the table is a checkbox to select that country;

  ```jsx
  <TableCell align="center">
    <Checkbox
      className={classes.checkbox}
      checked={country.selected}
      disableRipple={true}
      onChange={() => {
        const { __typename, selected, ...rest } = country;
        selectedCountryVar({ ...rest });
      }}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  </TableCell>
  ```

  We created a `selectedCountryVar` reactive variable in `cache.ts`. When the checkbox is checked, `selectedCountryVar` is updated with the selected country. `useCountriesLazyQuery` re-queries upon this change since the `selected` field depends on `selectedCountryVar`. `selected` field's value is created dynamically as true or false comparing `selectedCountryVar().code` and each contry's code value;

  ```jsx
  fields: {
          selected: (_, { readField }) => {
            const code = readField('code');
            return code === selectedCountryVar().code;
          },
        },

  ```

  In AC 2, we needed to manipulate the cache eighter by `cache.WriteData` or creating a resolver and using `cache.ReadQuery` & `cache.WriteQuery` to make one record selected. Reactive variables simplifies it a lot.

- We can remove any country

  Last cell of the table rows is an icon button to remove the country. We already set `keyFields: ['code']` in `Country` type policy in `cache.ts`. Now we can identify the country to find its id to evict from the cache `cache.evict({ id: cache.identify(country) });`. `useCountriesLazyQuery` hook gets notified by that cache update and requeries. So, countries page re-renderes with the remainin countries in the cache.

  ```jsx
  <TableCell align="center">
    <IconButton
      disableRipple={true}
      disableFocusRipple={true}
      className={classes.deleteButton}
      onClick={() => {
        cache.evict({ id: cache.identify(country) });
        cache.gc();

        if (selectedCountryVar().code === country.code) {
          selectedCountryVar(makeSelectedCountryType({}));
        }
      }}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  </TableCell>
  ```

- We can clear the query result.

  So far so good. One final behaviour is to clear the query result and return the page to a state when the query has not yet run. According to Apollo documentation,

  ```jsx
          onClick={() => {
            cache.evict({
              id: "ROOT_QUERY",
              fieldName: 'countries',
              broadcast: true
            });
            cache.gc();
          }}
  ```

  above code is supposed to remove all variances of `countries` query. i.e., all `countries` queries run with different arguments by now. AC 3 actually removes those query entities from `ROOT_QUERY`. That's OK. However, upon this cache update, our `useCountriesLazyQuery` gets notified and runs the query and fills the cache with all the countries! I tried several options, unfortunately non of them is a perfect fit. I opened an issue [https://github.com/apollographql/apollo-client/issues/7300](https://github.com/apollographql/apollo-client/issues/7300) still to be solved.

`src\pages\countries.tsx`

```jsx
import { useApolloClient } from '@apollo/client';
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import { RouteComponentProps } from '@reach/router';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import {
  cache,
  codeVar,
  makeSelectedCountryType,
  selectedCountryVar,
} from '../../apollo/cache';
import { Queries } from '../../apollo/queries';
import {
  CountriesQuery,
  CountriesQueryVariables,
  useCountriesLazyQuery,
} from '../../graphql/types';
import DisplayFormikState from '../components/DisplayFormikState';
import Layout from '../components/layout';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  checkbox: {
    padding: 0,
  },
  deleteButton: {
    margin: 0,
    padding: 0,
  },
  paper: {
    width: '100%',
    margin: '20px 0px 0px 0px',
    padding: 20,
  },
  tableContainer: {
    height: 500,
    margin: '20px 0px 0px 0px',
    padding: 20,
  },
});

interface CounriesProps extends RouteComponentProps {}

const Countries: React.FunctionComponent<CounriesProps> = (
  props: CounriesProps
) => {
  const classes = useStyles();
  const client = useApolloClient();

  const queryHandler = (code: string) => {
    countriesLazy({
      variables: {
        arg: {
          code: { regex: code },
        },
      },
    });
  };

  useEffect(() => {
    queryHandler(codeVar());
  }, []);

  const [countriesLazy, { data, loading, error }] = useCountriesLazyQuery();

  return (
    <Layout>
      <Grid container direction="column" justify="center" alignItems="center">
        <Paper variant="outlined" className={classes.paper}>
          <Formik initialValues={{ code: codeVar() }} onSubmit={(values) => {}}>
            {({ values, handleChange, resetForm }) => (
              <Grid
                item
                container
                direction="row"
                justify="flex-start"
                alignItems="center">
                <TextField
                  value={values.code}
                  label="code"
                  name="code"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    handleChange(e);
                    codeVar(e.target.value);
                  }}></TextField>

                <Button onClick={() => queryHandler(values.code)}>
                  <Typography variant="caption">Query</Typography>
                </Button>
                <Button
                  onClick={() => {
                    if (data && data.countries && data.countries.length > 0) {
                      selectedCountryVar(makeSelectedCountryType({}));
                      client.writeQuery < CountriesQuery,
                        CountriesQueryVariables >
                          {
                            query: Queries.QUERY_COUNTRIES,
                            data: {
                              countries: [],
                            },
                            variables: {
                              arg: {
                                code: { regex: codeVar() },
                              },
                            },
                          };
                      cache.evict({
                        id: 'ROOT_QUERY',
                        //fieldName: 'countries({"filter":{"code":{"regex":""}}})',
                        fieldName: 'countries',
                        broadcast: false,
                      });
                      cache.gc();
                      codeVar('');
                      resetForm();
                    }
                  }}>
                  <Typography variant="caption">Clear</Typography>
                </Button>
              </Grid>
            )}
          </Formik>
        </Paper>

        {loading && <p>Loading...</p>}
        {error && <p>Error :-(</p>}
        {data && (
          <TableContainer className={classes.tableContainer} component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Code</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Capital</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.countries.map((country) => (
                  <TableRow key={country.code}>
                    <TableCell align="center">
                      <Checkbox
                        className={classes.checkbox}
                        checked={country.selected}
                        disableRipple={true}
                        onChange={() => {
                          const { __typename, selected, ...rest } = country;
                          selectedCountryVar({ ...rest });
                        }}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </TableCell>
                    <TableCell align="center">{country.code}</TableCell>
                    <TableCell align="left">{country.name}</TableCell>
                    <TableCell align="left">{country.capital}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        disableRipple={true}
                        disableFocusRipple={true}
                        className={classes.deleteButton}
                        onClick={() => {
                          cache.evict({ id: cache.identify(country) });
                          cache.gc();

                          if (selectedCountryVar().code === country.code) {
                            selectedCountryVar(makeSelectedCountryType({}));
                          }
                        }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <DisplayFormikState {...selectedCountryVar()} />
      </Grid>
    </Layout>
  );
};

export default Countries;
```

Thanks for reading !
