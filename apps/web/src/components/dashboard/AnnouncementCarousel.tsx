import { useState, useEffect } from "react";
import { listLiveAnnouncements } from "@ttm/api/modules/announcement";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/Carousel";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Megaphone } from "lucide-react";
import { transformOembedToIframe } from "@ttm/utils/src/transformOembed";

const AnnouncementCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { data, isLoading, isFetching, isError, refetch } =
    listLiveAnnouncements(["live-announcements"], {});

  const { announcements } = data || {};

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (isLoading || isFetching) {
    return (
      <Card className="flex flex-col flex-1">
        <CardContent className="flex items-center justify-center">
          <Loading size="md" showText text="Loading announcements..." />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex flex-col flex-1">
        <CardContent className="flex items-center justify-center">
          <ErrorDisplay
            title="Error Loading Announcements"
            message="We encountered an error while loading announcements. Please try again."
            onRetry={refetch}
            retryText="Reload Announcements"
          />
        </CardContent>
      </Card>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <Card className="flex flex-col flex-1">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center">
            <Megaphone className="mb-4 h-16 w-16 text-gray-400" />
            <p className="text-lg text-gray-500">No announcements available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardContent className="relative flex-1 overflow-hidden">
        <div className="flex flex-row justify-end ">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-gray-200 absolute">
            <span className="text-sm font-medium">
              {current} / {announcements.length}
            </span>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="h-full w-full"
        >
          <CarouselContent className="h-full">
            {announcements.map((announcement) => (
              <CarouselItem key={announcement.id} className="h-full">
                <div className="flex h-full flex-col p-2">
                  <div className="flex h-full flex-col gap-4">
                    <div className="flex flex-shrink-0 items-start gap-4">
                      <h3 className="text-xl font-semibold">
                        {announcement.name}
                      </h3>
                    </div>
                    <div
                      className="ck-content h-[500px] overflow-y-auto pr-2"
                      style={{
                        scrollbarWidth: "thin",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: transformOembedToIframe(announcement.description),
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCarousel;
