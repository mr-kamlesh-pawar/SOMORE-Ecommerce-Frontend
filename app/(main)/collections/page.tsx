import ShopPageOne from "@/components/pages/shop-pages/ShopPageOne";
import { newLaunchProducts } from "@/data/NewLaunches/newLaunchProducts";
import React from "react";

function CollectionPage() {
  return (
    <div>
      <ShopPageOne  products={newLaunchProducts} title="Collections" category="collections"/>
    </div>
  );
}

export default CollectionPage;
