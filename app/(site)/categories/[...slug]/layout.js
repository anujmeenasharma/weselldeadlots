export async function generateMetadata({ params }) {
    const { slug } = await params;
    return {
        alternates: {
            canonical: `/categories/${slug.join('/')}`
        }
    };
}

export default async function Layout({ children, params }) {
    const { slug } = await params;
    
    const itemListElement = [
        {
            "@type": "ListItem", 
            "position": 1, 
            "name": "Home",
            "item": "https://www.weselldeadlots.com/"  
        },
        {
            "@type": "ListItem", 
            "position": 2, 
            "name": "Categories",
            "item": "https://www.weselldeadlots.com/categories"  
        }
    ];

    let currentPath = "https://www.weselldeadlots.com/categories";
    slug.forEach((item, index) => {
        currentPath += `/${item}`;
        const name = item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        itemListElement.push({
            "@type": "ListItem", 
            "position": index + 3, 
            "name": name,
            "item": currentPath
        });
    });

    const jsonLd = {
        "@context": "https://schema.org/", 
        "@type": "BreadcrumbList", 
        "itemListElement": itemListElement
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
