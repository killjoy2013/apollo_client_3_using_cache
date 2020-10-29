import { Router } from '@reach/router'
import React from 'react'
import { ApolloProvider } from "@apollo/client";
import { client } from "../../ApolloProxy";
import Routes from '../modules/Routes'

const App = ()=>{

    return (<ApolloProvider client={client}><Routes/></ApolloProvider>)
}

export default App