import * as React from "react";
import { Router} from "@reach/router";
import { Link } from "@reach/router";
import Cars from "./Cars";
import Cities from "./Cities";
import Countries from './Countries';

import {
  AppBar,
  Toolbar,
  makeStyles,
  createStyles,
  Theme
} from "@material-ui/core";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    href: {
      margin: 20,
      color: "white"
    }
  })
);

const Routes = () => {
  const classes = useStyles({});
  return (
    <Router>
      {/* <div>
        <AppBar position="static">
          <Toolbar>
            <Link className={classes.href} to="/">
              Home
            </Link>
            <Link className={classes.href} to="/cars">
              Cars
            </Link>
            <Link className={classes.href} to="/cities">
              Cities
            </Link>
            <Link className={classes.href} to="/countries">
              Countries
            </Link>
          </Toolbar>
        </AppBar>
        
      </div> */}
      <Cars path="/app/cars" />
      <Cities path="/app/cities" />
      <Countries path="/app/countries" />
    </Router>
  );
};

export default Routes;
