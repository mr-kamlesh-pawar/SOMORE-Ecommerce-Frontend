import ShopPageOne from "@/components/pages/shop-pages/ShopPageOne";
import ShopPageTwo from "@/components/pages/shop-pages/ShopPageTwo";
import { newLaunchProducts } from "@/data/NewLaunches/newLaunchProducts";
import { SearchParams } from "@/types";
import React from "react";

function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <div>
      <ShopPageOne  products={newLaunchProducts} title="All Products"/>
      {/* <ShopPageTwo searchParams={searchParams}/> */}
    </div>
  );
}

export default ShopPage;
