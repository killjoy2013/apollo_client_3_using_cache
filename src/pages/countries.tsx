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

  const [countriesLazy, { data, loading, error }] = useCountriesLazyQuery({
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only',
  });

  console.log('COUNTRIES RENDERED');

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
                    selectedCountryVar(makeSelectedCountryType({}));
                    cache.evict({
                      id: 'ROOT_QUERY',
                      fieldName: 'countries',
                      broadcast: true,
                    });
                    cache.gc();
                    codeVar('');
                    resetForm();
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
