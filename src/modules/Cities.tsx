import * as React from "react";
import { Formik, useFormikContext } from "formik";
import TextField from "@material-ui/core/TextField";
import {
  Grid,
  Button,
  makeStyles,
  Theme,
  createStyles,
  Typography
} from "@material-ui/core";
import DisplayFormikState from "./DisplayFormikState";
import {
  City
} from "../../graphql/types";
import clsx from "clsx";
import {cityFormVar} from '../../apollo/cache'
import { RouteComponentProps } from "@reach/router";
import Layout from "../components/layout";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      width: 250
    },
    input: {
      width: 250
    },
    visible: {
      visibility: "visible"
    },
    hidden: {
      visibility: "hidden"
    }
  })
);

interface CityFormProps {}
const CityForm = (props: CityFormProps) => {
  const classes = useStyles(props);
  const formik = useFormikContext<City>();
  const submitCountClassName = clsx({
    [classes.visible]: formik.submitCount > 0,
    [classes.hidden]: formik.submitCount === 0
  });

  return (
    <form>
      <Grid container direction="column" justify="center" alignItems="center">
        <TextField
          className={classes.input}
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          variant="outlined"
          margin="normal"
        />

        <TextField
          className={classes.input}
          name="country"
          label="Country"
          value={formik.values.country}
          onChange={formik.handleChange}
          variant="outlined"
          margin="normal"
        />

        <TextField
          className={classes.input}
          name="population"
          label="Population"
          value={formik.values.population}
          onChange={formik.handleChange}
          variant="outlined"
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => formik.submitForm()}
        >
          Persist Cities
        </Button>
        <Typography
          className={submitCountClassName}
          variant="subtitle1"
          color="textSecondary"
        >
          {`City form is persisted ${formik.submitCount}. time`}
        </Typography>
      </Grid>
      <DisplayFormikState {...formik.values} />
    </form>
  );
};

interface ICities extends RouteComponentProps {}

const Cities: React.FunctionComponent<ICities> = (props: ICities) => {
 
  return (
    <Layout>
    <Formik
      initialValues={cityFormVar()}
      onSubmit={values =>{
        cityFormVar(values)
      }}
    >
      <CityForm />
    </Formik>
    </Layout>
  );
};

export default Cities;
