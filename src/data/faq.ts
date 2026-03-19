export type FAQItem = {
    question: string;
    answer: string;
};

export type FAQCategory = {
    category: string;
    items: FAQItem[];
};

export const FAQ_DATA: FAQCategory[] = [
    {
        category: "General",
        items: [
            {
                question: "What is PHI.ai?",
                answer:
                    "PHI.ai is a tool that helps educators, students, and creators generate stunning mathematical and scientific animations using AI, without needing to write any code.",
            },
            {
                question: "Do I need to know how to code?",
                answer:
                    "No! PHI.ai is designed to be completely code-free. You simply describe the animation you want in plain English, and our AI generates it for you.",
            },
            {
                question: "How accurate are the animations?",
                answer:
                    "Our AI is trained to generate mathematically accurate animations using the Manim library, which is widely used in the math community for high-precision visuals.",
            },
        ],
    },
    {
        category: "Pricing & Plans",
        items: [
            {
                question: "Is PHI.ai free to use?",
                answer:
                    "We offer a free plan for getting started. For advanced features and higher usage limits, we have paid subscription plans available. Check out our Pricing page for more details.",
            },
            {
                question: "Can I use the animations for commercial purposes?",
                answer:
                    "Yes, animations generated on our paid plans often come with commercial usage rights. Please refer to our Terms of Service for specific details regarding your plan.",
            },
        ],
    },
    {
        category: "Company",
        items: [
            {
                question: "Who is behind PHI.ai?",
                answer:
                    "PHI.ai is createad and maintained by ThinkersLabe.com which was founded by Murtaza Abdullah in Jan, 2026",
            },
            {
                question: "How can I contact support?",
                answer:
                    "You can reach out to our support team via the contact form on our website or by emailing murtazaabdullah989@gmail.com",
            },
        ],
    },
];
