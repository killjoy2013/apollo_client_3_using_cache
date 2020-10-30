import {
  ApolloClient,
  ApolloLink,
  createHttpLink
} from "@apollo/client";
import fetch from 'isomorphic-fetch'
import { cache } from './cache';


const httpLink = createHttpLink({
  uri: "https://countries.trevorblades.com/",
  fetch
  //uri: "https://rickandmortyapi.com/graphql"
});
const link = ApolloLink.from([httpLink]);

export const client = new ApolloClient({
  link,
  cache: cache
});
