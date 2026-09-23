import { FaSquareXTwitter } from "react-icons/fa6";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

export type TestimonialCard = {
  id: string;
  name: string;
  designation: string;
  testimonial: string;
  avatar: string;
};

const Testimonials = ({
  testimonials,
}: {
  testimonials: TestimonialCard[];
}) => (
  <div className="px-6 py-20 font-mono">
    <div>
      <h2 className="text-3xl  font-bold tracking-tight text-center text-[#eef3fb] md:text-3xl lg:text-7xl mb-10">
        What our customers say
      </h2>
      <p className="mt-3.5 text-center text-muted-foreground text-xl tracking-[-0.015em] md:text-2xl">
        Discover what our valued customers think about our innovative products
      </p>
      <div className="mx-auto mt-14 max-w-(--breakpoint-xl) text-black columns-1 gap-8 md:columns-2 lg:columns-3">
        {testimonials.map((testimonial) => (
          <div
            className="relative mb-8 break-inside-avoid rounded-xl bg-muted p-6 dark:bg-muted/60"
            key={testimonial.id}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    unoptimized
                  />
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.designation}
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <FaSquareXTwitter className="size-6 text-black" />
              </div>
            </div>
            <p className="mt-5 text-[17px]">{testimonial.testimonial}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Testimonials;
