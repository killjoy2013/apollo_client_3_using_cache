import Grid from '@material-ui/core/Grid/Grid';
import React from 'react';
import Image from '../components/image';
import Layout from '../components/layout';
import './index.css';

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1,
//     },
//     paper: {
//       padding: theme.spacing(2),
//       textAlign: 'center',
//       color: theme.palette.text.secondary,
//     },
//   })
// );

export default function Home() {
  // const classes = useStyles();
  return (
    <Layout>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </Layout>
  );
}
