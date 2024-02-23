import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import ErrorMsg from '@saashq/ui/src/components/ErrorMsg';
import Spinner from '@saashq/ui/src/components/Spinner';

import DumbHome from '../components/Home';
import { queries } from '../graphql';

function Home() {
  const { data, loading, error } = useQuery(gql(queries.shqGet));

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  return <DumbHome shq={data.shqGet} />;
}

export default Home;
