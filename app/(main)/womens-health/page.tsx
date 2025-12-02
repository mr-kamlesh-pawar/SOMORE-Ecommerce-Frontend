import ShopPageOne from "@/components/pages/shop-pages/ShopPageOne";
import { newLaunchProducts } from "@/data/NewLaunches/newLaunchProducts";
import React from "react";

function WomensHealthPage() {
  return (
    <div>
      <ShopPageOne  products={newLaunchProducts} title="Women's Health" category="womens-health"/>
    </div>
  );
}

export default WomensHealthPage;
