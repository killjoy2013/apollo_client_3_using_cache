import Grid from '@material-ui/core/Grid/Grid';
import React from 'react';
import Image from '../components/image';
import Layout from '../components/layout';
import './index.css';

export default function Home() {
  return (
    <Layout>
      <h1>Hi people</h1>
      <p>This is Gatsby & Graphql Code Generator & Apollo Client 3</p>

      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </Layout>
  );
}
