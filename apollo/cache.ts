import { InMemoryCache, makeVar } from '@apollo/client';
import { Car, City, Country, SelectedCountryType } from '../graphql/types';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Country: {
      keyFields: ['code'],
      fields: {
        nameWithEmoji: (_, { readField }) => {
          const name = readField('name');
          const emoji = readField('emoji');
          return `${name} ${emoji}`;
        },
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
