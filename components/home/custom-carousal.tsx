"use client";
import Link from "next/link";
import { CarouselItem } from "../ui/carousel";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

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
    // TODO: Update click count for banner
  };

  return (
    <CarouselItem className="pl-4" onClick={() => updateClickCount(id)}>
      <Link href={link_url || "/"}>
        <div className="relative w-full aspect-[7/4] sm:aspect-[7/3] rounded overflow-hidden">
          <Image
            alt="Banner Image"
            src={image_url}
            fill
            className="object-cover transition duration-300 hover:brightness-100 brightness-100 dark:brightness-75"
          />
          <p className="absolute z-10 text-2xl md:text-3xl lg:text-4xl bottom-6 left-6 md:bottom-8 md:left-10 lg:bottom-10 lg:left-10 font-semibold mix-blend-difference text-white">
            {title}
          </p>
        </div>
      </Link>
    </CarouselItem>
  );
};

export const CustomCarousalSkeleton = () => {
  return (
    <Skeleton className="h-full w-full aspect-[7/4] sm:aspect-[7/3] rounded overflow-hidden" />
  );
};
