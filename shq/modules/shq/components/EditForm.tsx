import React, { useState } from "react";
import { TabTitle, Tabs } from "../../common/tabs";

import Appearance from "./Appearance";
import General from "../containers/General";
import { IShq } from "../../types";
import { __ } from "../../../utils";

type Props = {
  shq: IShq;
  edit: (variables: IShq) => void;
};

function EditFrom(props: Props) {
  const [currentTab, setCurrentTab] = useState("General");

  const renderTabContent = () => {
    if (currentTab === "General") {
      return <General {...props} />;
    }

    return <Appearance {...props} />;
  };

  return (
    <>
      <Tabs full={true}>
        <TabTitle
          className={currentTab === "General" ? "active" : ""}
          onClick={() => setCurrentTab("General")}
        >
          {__("General")}
        </TabTitle>
        <TabTitle
          className={currentTab === "Mobile App" ? "active" : ""}
          onClick={() => setCurrentTab("Mobile App")}
        >
          {__("Mobile App")}
        </TabTitle>
      </Tabs>
      {renderTabContent()}
    </>
  );
}

export default EditFrom;
