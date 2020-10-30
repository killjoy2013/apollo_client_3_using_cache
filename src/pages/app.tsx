import { Router } from '@reach/router'
import React from 'react'
import { ApolloProvider } from "@apollo/client";
import { client } from "../../apollo/ApolloProxy";
import Routes from '../modules/Routes'

const App = ()=>{

    return (<Routes/>)
}

export default App