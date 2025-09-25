import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface Item {
  id: string;
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: Item[] }) {
  return (
    <Accordion type="single" collapsible>
      {items.map((f) => (
        <AccordionItem key={f.id} value={f.id} id={f.id}>
          <AccordionTrigger className="text-left">
            {f.question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground whitespace-pre-line">
              {f.answer}
            </p>
            <div className="mt-2 text-xs">
              <Link href={`#${f.id}`} className="text-primary">
                Link
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
