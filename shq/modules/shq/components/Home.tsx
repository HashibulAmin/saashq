import AddForm from "../containers/AddForm";
import EditForm from "../containers/EditForm";
import { IShq } from "../../types";
import React from "react";
import Wrapper from "../../layout/components/Wrapper";

type Props = {
  shq?: IShq;
};

function Home(props: Props) {
  const { shq } = props;

  const leftActionBar = <div>{shq ? shq.name : ""}</div>;

  const content = () => {
    if (shq) {
      return <EditForm shq={shq} />;
    }

    return <AddForm />;
  };

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={"Shq core"}
          breadcrumb={[{ title: "Shq core" }]}
        />
      }
      actionBar={<Wrapper.ActionBar left={leftActionBar} />}
      content={content()}
    />
  );
}

export default Home;
