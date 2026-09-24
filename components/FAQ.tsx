import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export default function FAQ({ items }: { items: FaqItem[] }) {
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
