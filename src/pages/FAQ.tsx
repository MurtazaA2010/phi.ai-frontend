import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_DATA } from "@/data/faq";

const FAQ = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-32 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Everything you need to know about PHI.ai. Can't find the answer you're looking for? Reach out to our support team.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 border-t border-border/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {FAQ_DATA.map((category, categoryIndex) => (
                            <div key={categoryIndex}>
                                <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {category.items.map((item, itemIndex) => (
                                        <AccordionItem
                                            key={itemIndex}
                                            value={`item-${categoryIndex}-${itemIndex}`}
                                        >
                                            <AccordionTrigger className="text-lg font-semibold text-left">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default FAQ;
