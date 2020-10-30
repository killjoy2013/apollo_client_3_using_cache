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
