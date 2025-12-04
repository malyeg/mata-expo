import { OutgoingDealsRoute } from "@/app/(main)/(stack)/deals";
import { useRoute } from "@react-navigation/core";
import React from "react";
import { DealsList } from "./DealsList";

const OutgoingDeals = () => {
  const route = useRoute<OutgoingDealsRoute>();
  const archived = route?.params?.archived === true;

  return <DealsList type="outgoing" archived={archived} />;
};

export default OutgoingDeals;
