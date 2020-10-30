/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import Header from "./header"

import { AppBar, createStyles, makeStyles, Theme, Toolbar } from "@material-ui/core"


const useStyles = makeStyles((theme: Theme) =>
{ 
 return createStyles({
    href: {
      margin: 20,
      color: "white"
    },
    appBar:{
      width: '100%'
    }
  })
}
);

interface Props{
  children: React.ReactNode
}

const Layout = ({ children }:Props) => {
  const classes = useStyles({});
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
   
      
      <>
      <AppBar position="static">
          <Toolbar>
            <Link className={classes.href} to="/">
              Home
            </Link>
            <Link className={classes.href} to="/app/cars">
              Cars
            </Link>
            <Link className={classes.href} to="/app/cities">
              Cities
            </Link>
            <Link className={classes.href} to="/countries">
              Countries
            </Link>
          </Toolbar>
        </AppBar>
        <main>{children}</main>
        </>
      
   
  )
}


export default Layout
