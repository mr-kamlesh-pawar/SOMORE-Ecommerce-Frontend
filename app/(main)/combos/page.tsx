import ShopPageOne from "@/components/pages/shop-pages/ShopPageOne";
import { newLaunchProducts } from "@/data/NewLaunches/newLaunchProducts";
import React from "react";

function ComboPage() {
  return (
    <div>
      <ShopPageOne  products={newLaunchProducts} title="Combos" category="combo"/>
    </div>
  );
}

export default ComboPage;
