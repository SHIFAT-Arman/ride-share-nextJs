import { FaSquareXTwitter } from "react-icons/fa6";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    company: "TechCorp",
    testimonial:
      "This product has completely transformed the way we work. The efficiency and ease of use are unmatched!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Sophia Lee",
    designation: "Data Analyst",
    company: "InsightTech",
    testimonial:
      "This tool has saved me hours of work! The analytics and reporting features are incredibly powerful.",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "UX Designer",
    company: "DesignPro",
    testimonial:
      "An amazing tool that simplifies complex tasks. Highly recommended for professionals in the industry. " +
      "The intuitive interface makes it easy to onboard new team members, and the automation features save us countless hours every week. ",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "Marketing Specialist",
    company: "BrandBoost",
    testimonial:
      "I've seen a significant improvement in our team's productivity since we started using this service.",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    name: "Daniel Martinez",
    designation: "Full-Stack Developer",
    company: "CodeCrafters",
    testimonial:
      "The best investment we've made! The support team is also super responsive and helpful.",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    name: "Jane Smith",
    designation: "Product Manager",
    company: "InnovateX",
    testimonial:
      "The user experience is top-notch! The interface is clean, intuitive, and easy to navigate.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

const Testimonials = () => (
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
                  />
                  {/* <AvatarFallback className="bg-primary font-medium text-primary-foreground text-xl">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback> */}
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
