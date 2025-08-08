"use client";

import Link from "next/link";
import { CarouselItem } from "../ui/carousel";
import Image from "next/image";

interface CustomCarousalProps {
  id: string;
  link_url: string;
  image_url: string;
  title: string;
}

export const CustomCarousal = ({
  id,
  link_url,
  image_url,
  title,
}: CustomCarousalProps) => {
  const updateClickCount = async (id: string) => {
    console.log("Updating click count for banner:", id);
  };
  return (
    <CarouselItem className="pl-4" onClick={() => updateClickCount(id)}>
      <Link href={link_url || "/"}>
        <div className="relative w-full aspect-square sm:aspect-[21/9] rounded-2xl overflow-hidden">
          <Image alt="Banner Image" src={image_url} fill />
          <p className="absolute z-10 text-2xl md:text-3xl lg:text-4xl bottom-6 left-6 md:bottom-8 md:left-10 lg:bottom-10 lg:left-10 font-light mix-blend-difference text-white">
            {title}
          </p>
        </div>
      </Link>
    </CarouselItem>
  );
};
