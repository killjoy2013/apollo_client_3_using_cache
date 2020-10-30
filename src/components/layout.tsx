import {
  AppBar,
  createStyles,
  makeStyles,
  Theme,
  Toolbar,
} from '@material-ui/core';
import { Link } from 'gatsby';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    href: {
      margin: 20,
      color: 'white',
    },
    appBar: {
      width: '100%',
    },
  });
});

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const classes = useStyles({});

  return (
    <>
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
      <main>{children}</main>
    </>
  );
};

export default Layout;
