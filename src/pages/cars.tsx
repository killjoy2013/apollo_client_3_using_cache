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

  console.log('CARS RENDERED');

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
