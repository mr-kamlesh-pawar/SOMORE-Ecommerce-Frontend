import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="brand"
        width={300}
        height={200}
        priority
        style={{ height: "auto" }}  
        className="
          w-[120px]
          sm:w-[180px]
          md:w-[190px]
          lg:w-[170px]
          xl:w-[190px]
        "
      />
    </Link>
  );
};

export default Logo;
