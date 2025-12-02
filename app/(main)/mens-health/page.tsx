import ShopPageOne from "@/components/pages/shop-pages/ShopPageOne";
import { newLaunchProducts } from "@/data/NewLaunches/newLaunchProducts";
import React from "react";

function MensHealthPage() {
  return (
    <div>
      <ShopPageOne  products={newLaunchProducts} title="Mens Health Products" category="mens-health"/>
    </div>
  );
}

export default MensHealthPage;
