import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="brand"
        width={300}
        height={200}
        className="
          w-[120px]     /* mobile */
          sm:w-[180px] /* small devices */
          md:w-[190px] /* tablet */
          lg:w-[170px] /* desktop */
          xl:w-[190px] /* large screens */
          h-auto
        "
      />
    </Link>
  );
};

export default Logo;
