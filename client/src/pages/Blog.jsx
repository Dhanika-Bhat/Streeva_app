import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import './Blog.css';

const stories = [
    {
        id: 1,
        name: "Falguni Nayar",
        company: "Nykaa",
        image: "https://i0.wp.com/bwretailworld.com/wp-content/uploads/2025/08/Screenshot-2025-08-04-114311.png?fit=742%2C672&ssl=1",
        quote: "Think big, but start small.",
        story: "At the age of 50, when most people think about retirement, Falguni Nayar left a comfortable job as a managing director at Kotak Mahindra Capital to start Nykaa. She noticed a huge gap in the Indian beauty market, where customers couldn't get authentic products easily. Today, Nykaa is a multi-billion dollar empire, proving that age is just a number when it comes to entrepreneurship."
    },
    {
        id: 2,
        name: "Kiran Mazumdar-Shaw",
        company: "Biocon",
        image: "https://imageio.forbes.com/specials-images/imageserve/5deec3bf25ab5d000700aa1a/0x0.jpg?format=jpg&crop=501,500,x136,y0,safe&height=416&width=416&fit=bounds",
        quote: "I want to be remembered as someone who made a difference to global healthcare.",
        story: "Starting in the garage of her rented house in Bangalore in 1978 with just Rs. 10,000, Kiran faced immense challenges. Banks refused her loans because biotechnology was an unknown field and she was a woman. She persisted, and today Biocon is Asia's premier biopharmaceutical enterprise, driving affordable innovation globally."
    },
    {
        id: 3,
        name: "Richa Kar",
        company: "Zivame",
        image: "https://m.economictimes.com/thumb/msid-56613914,width-1200,height-900,resizemode-4,imgsize-131338/zivame-founder-richa-kar-to-pull-back-from-daily-operations-coo-to-take-over.jpg",
        quote: "When you believe in your idea, the world eventually aligns.",
        story: "Richa Kar revolutionized the lingerie market in India. Recognizing the discomfort women faced while shopping for intimate wear in physical stores, she launched Zivame. Despite the social taboo and initial resistance from investors, Zivame has become synonymous with women's comfort and confidence."
    },
    {
        id: 4,
        name: "Vandana Luthra",
        company: "VLCC",
        image: "https://www.seema.com/wp-content/uploads/2022/05/Vandana-Luthra.jpg",
        quote: "A strong woman builds her own world.",
        story: "Vandana started VLCC in 1989 when the wellness industry was practically non-existent in India. Balancing family life and a fledgling startup, she introduced professional weight management and beauty programs. Today, VLCC operates across 153 cities and 13 countries, fundamentally changing health and beauty norms."
    }
];

export default function Blog() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="blog-page">
            <div className="blog-hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="blog-header">
                        <div className="badge badge-gold" style={{ marginBottom: '16px' }}><BookOpen size={14} /> Inspiring Stories</div>
                        <h1>Women Who Changed The Game</h1>
                        <p>Real stories of Indian women entrepreneurs who defied the odds, broke the glass ceiling, and built empires.</p>
                    </motion.div>
                </div>
            </div>

            <div className="container section">
                <div className="blog-grid">
                    {stories.map((story, i) => (
                        <motion.div
                            key={story.id}
                            className="blog-card card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="blog-img-wrapper">
                                <img src={story.image} alt={story.name} />
                                <div className="blog-company-tag">{story.company}</div>
                            </div>
                            <div className="blog-content">
                                <h3>{story.name}</h3>
                                <div className="blog-quote">"{story.quote}"</div>
                                <p>{story.story}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="blog-cta glass">
                    <h2>Start Your Own Story</h2>
                    <p>Every empire starts with a single step. Join Streeva and start selling your products today.</p>
                    <a href="/register" className="btn btn-primary btn-lg">Become a Seller <ArrowRight size={18} /></a>
                </div>
            </div>
        </div>
    );
}
