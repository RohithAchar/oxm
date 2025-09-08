import { getBanners } from "@/lib/controller/home/banner";
import { getCurrentDateAndTime } from "@/utils/static";
import { Carousel, CarouselContent } from "../ui/carousel";
import { CustomCarousal } from "./custom-carousal";

export const Carousal = async () => {
  const banners = await getBanners();
  const currentDateAndTime = getCurrentDateAndTime();

  // Use system time for consistency with UTC banner times
  const now = new Date();

  let activeBanners = banners.filter((banner) => {
    const isActive = banner.is_active;

    // Convert banner dates to Date objects for comparison
    const startDate = banner.start_at ? new Date(banner.start_at) : null;
    const endDate = banner.end_at ? new Date(banner.end_at) : null;

    const isInDateRange =
      (!startDate || startDate <= now) && (!endDate || endDate >= now);

    return isActive && isInDateRange && banner.image_url;
  });

  // Create fallback banner if no active banners exist
  if (activeBanners.length === 0) {
    activeBanners = [
      {
        alt_text: "Banner Image",
        click_count: 0,
        computed_ctr: 0,
        created_at: currentDateAndTime,
        end_at: currentDateAndTime,
        id: "fallback-1",
        image_url: "/image.jpeg",
        impression_count: 0,
        is_active: true,
        link_url: "/",
        start_at: currentDateAndTime,
        title: "Welcome to OpenXmart",
        updated_at: currentDateAndTime,
      },
    ];
  }

  return (
    <Carousel>
      <CarouselContent>
        {activeBanners.map((banner) => (
          <CustomCarousal
            key={banner.id}
            id={banner.id}
            link_url={banner.link_url || "/"}
            image_url={banner.image_url}
            title={banner.title}
          />
        ))}
      </CarouselContent>
    </Carousel>
  );
};