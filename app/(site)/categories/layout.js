export const metadata = {
    alternates: {
        canonical: '/categories'
    }
};

export default function Layout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org/", 
        "@type": "BreadcrumbList", 
        "itemListElement": [{
            "@type": "ListItem", 
            "position": 1, 
            "name": "Home",
            "item": "https://www.weselldeadlots.com/"  
        },{
            "@type": "ListItem", 
            "position": 2, 
            "name": "Categories",
            "item": "https://www.weselldeadlots.com/categories"  
        }]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
