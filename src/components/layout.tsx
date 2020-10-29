/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import Header from "./header"
import "./layout.css"
import { AppBar, createStyles, makeStyles, Theme, Toolbar } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    href: {
      margin: 20,
      color: "white"
    }
  })
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
      {/* <Header siteTitle={data.site.siteMetadata?.title || `Title`} /> */}
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
            <Link className={classes.href} to="/app/countries">
              Countries
            </Link>
          </Toolbar>
        </AppBar>
        <main>{children}</main>
      {/* <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        <footer style={{
          marginTop: `2rem`
        }}>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </footer>
      </div> */}
    </>
  )
}


export default Layout
