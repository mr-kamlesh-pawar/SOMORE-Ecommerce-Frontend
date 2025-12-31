import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="brand"
        width={250} // Original width
        height={180} // Original height
        priority
        className="
          w-[90px] h-auto
          sm:w-[120px] 
          md:w-[170px]
          lg:w-[120px]
          xl:w-[120px]
        "
        style={{ 
          height: 'auto', // This maintains aspect ratio
          maxWidth: '100%'
        }}
      />
    </Link>
  );
};

export default Logo;