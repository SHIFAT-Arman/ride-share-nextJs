import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    id: "booking",
    question: "How do I book a ride?",
    answer:
      "Open the portal, enter pickup and destination, pick a time, and confirm. Driver details appear before departure.",
  },
  {
    id: "pricing",
    question: "How are fares calculated?",
    answer:
      "Fares use distance, route demand, and vehicle type. You see the full price before you confirm — no hidden fees.",
  },
  {
    id: "payment",
    question: "Is payment secure?",
    answer:
      "Yes. All payments are encrypted. We accept major cards and digital wallets through our secure checkout.",
  },
  {
    id: "cancel",
    question: "Can I cancel my ride?",
    answer:
      "Cancel free up to 2 hours before pickup. Later cancellations may incur a small fee shown at checkout.",
  },
  {
    id: "coverage",
    question: "What areas do you serve?",
    answer:
      "We cover intercity and long-distance routes across major regions. Check the portal for live availability on your route.",
  },
  {
    id: "driver",
    question: "How do I become a driver?",
    answer:
      "Register in the portal, submit your vehicle details and documents, and pass our verification. Approval usually takes 2–3 business days.",
  },
];

export default function FAQ() {
  return (
    <section
      aria-label="Frequently asked questions"
      className="w-full max-w-7xl mx-auto px-6 py-16 font-mono"
    >
      <h2 className="text-3xl font-bold tracking-tight text-center text-[#eef3fb] md:text-3xl lg:text-7xl mb-10">
        Frequently Asked Question
      </h2>

      <Accordion multiple className="w-full rounded-none border-none">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="data-open:bg-transparent"
          >
            <AccordionTrigger className="text-base md:text-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
