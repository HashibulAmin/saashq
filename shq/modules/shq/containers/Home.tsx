import DumbHome from "../components/Home";
import ErrorMsg from "../../common/ErrorMsg";
import React from "react";
import Spinner from "../../common/Spinner";
import gql from "graphql-tag";
import { queries } from "../graphql";
import { useQuery } from "@apollo/client";

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
