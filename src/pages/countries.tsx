import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import { selectedCountryVar, cache } from '../../apollo/cache';

import clsx from 'clsx';
import { useCountriesLazyQuery, useCountriesQuery } from '../../graphql/types';
import DisplayFormikState from '../components/DisplayFormikState';
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
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
  //const {data, loading, error} = useCountriesQuery()

  useEffect(() => {
    countriesLazy();
  }, []);

  const [countriesLazy, { data, loading, error }] = useCountriesLazyQuery();

  const [arg, setArg] = useState('');

  return (
    <Layout>
      <Grid container direction="column" justify="center" alignItems="center">
        <Paper variant="outlined" className={classes.paper}>
          <Grid
            item
            container
            direction="row"
            justify="flex-start"
            alignItems="center">
            <TextField
              label="code"
              variant="outlined"
              size="small"
              onChange={(e) => setArg(e.target.value)}></TextField>
            <Button
              onClick={() =>
                countriesLazy({
                  variables: {
                    arg: {
                      code: { regex: arg },
                    },
                  },
                })
              }>
              <Typography variant="caption">Query</Typography>
            </Button>
            <Button onClick={() => {}}>
              <Typography variant="caption">Clear</Typography>
            </Button>
          </Grid>
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
                      {/* <input
                        type="checkbox"
                        checked={country.selected}
                        onChange={() => {
                          const { __typename, selected, ...rest } = country;
                          selectedCountryVar({ ...rest });
                        }}
                      /> */}
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
