import React from 'react'
import {graphql, Link} from 'gatsby'
import { useQuery, gql} from '@apollo/client'
import { query } from './using-typescript';

export const GATSBY_QUERY=graphql`
    {
    rickAndMorty{
        character(id:1){
        name
        gender
        origin{
            name
        }
        image
        }
    }
    }`

 export const APOLLO_QUERY = gql`
    {
        character(id:2){
            name
            image
        }
    }`
    
    const Dyn = ()=>{
        const {data, loading, error} = useQuery(APOLLO_QUERY)

        return(<>
        {loading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
        {data && <img src={data.character.image} alt={data.character.name} style={{width:300}}></img>}        
        </>
        )
    }



export default ({data: {rickAndMorty:{character}}})=>{

    

    return <div style={{textAlign:'center', width:600, margin:'50px auto'}}>
        <h1>Hello {character.name}</h1>
        <img src={character.image} alt={character.name} style={{width:300}}></img>
       <Dyn/>
        <p>
        <Link to="/">Go back to the homepage</Link>
        </p>
    </div>
}