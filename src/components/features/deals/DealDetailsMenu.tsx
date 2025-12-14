import { Deal } from "@/api/dealsApi";
import AppMenu from "@/components/menu/AppMenu";
import { CancelDealMenuItem } from "@/components/menu/CancelDealMenuItem";
import useAuth from "@/hooks/useAuth";
import React from "react";

type DealDetailsMenuProps = {
  deal: Deal;
};

const DealDetailsMenu = ({ deal }: DealDetailsMenuProps) => {
  const { user } = useAuth();

  // Show cancel option for:
  // - Outgoing deals (user is offer owner): when status is "new" or "accepted"
  // - Incoming deals (user is item owner): only when status is "accepted"
  // Hide cancel for incoming deals when status is "new"
  const isOutgoingDeal = user?.id === deal.userId;
  const showCancelOption =
    (deal.status === "new" && isOutgoingDeal) || deal.status === "accepted";

  if (!showCancelOption) {
    return null;
  }

  return (
    <AppMenu>
      <CancelDealMenuItem deal={deal} />
    </AppMenu>
  );
};

export default DealDetailsMenu;
