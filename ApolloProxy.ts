import {
  ApolloClient,
  ApolloLink,
  createHttpLink
} from "@apollo/client";
import { cache } from './cache';


const httpLink = createHttpLink({
  uri: "https://countries.trevorblades.com/"
});
const link = ApolloLink.from([httpLink]);

export const client = new ApolloClient({
  link,
  cache: cache
});
