import { IngoingDealsRoute } from "@/app/(main)/(stack)/deals";
import { useRoute } from "@react-navigation/core";
import React from "react";
import { DealsList } from "./DealsList";

const IncomingDeals = () => {
  const route = useRoute<IngoingDealsRoute>();
  const archived = route?.params?.archived === true;

  return <DealsList type="incoming" archived={archived} />;
};

export default IncomingDeals;
