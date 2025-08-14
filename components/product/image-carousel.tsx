"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import React from "react";

interface Images {
  id: string;
  image_url: string;
}
export const ImageCarousel = ({ images }: { images: Images[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} plugins={[]} className="w-full mx-auto">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <div>
              <Card className="p-0">
                <CardContent className="relative rounded-xl aspect-square">
                  <Image
                    fill
                    src={image.image_url}
                    alt="Product Image"
                    className="object-cover object-center rounded-xl"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <p className="text-sm text-muted-foreground text-center mt-1">
        Slide {current} of {count}
      </p>
    </Carousel>
  );
};
