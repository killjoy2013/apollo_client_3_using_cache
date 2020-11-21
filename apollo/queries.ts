import gql from 'graphql-tag';

const QUERY_COUNTRIES = gql`
  query countries($arg: CountryFilterInput) {
    countries(filter: $arg) {
      code
      name
      capital
      emoji
      selected @client
    }
  }
`;

export const Queries = {
  QUERY_COUNTRIES,
};
