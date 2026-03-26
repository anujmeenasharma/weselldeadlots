export async function generateMetadata({ params }) {
    const { slug } = await params;
    return {
        alternates: {
            canonical: `/categories/${slug.join('/')}`
        }
    };
}

export default function Layout({ children }) {
    return children;
}
