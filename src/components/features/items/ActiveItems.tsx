import React from "react";
import { MyItemsList } from "./MyItemsList";

const ActiveItems = () => {
  return <MyItemsList status={["online", "draft"]} />;
};

export default ActiveItems;


