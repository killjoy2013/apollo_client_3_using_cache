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
