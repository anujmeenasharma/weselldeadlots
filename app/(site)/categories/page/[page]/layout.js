export async function generateMetadata({ params }) {
    const { page } = await params;
    return {
        alternates: {
            canonical: `/categories/page/${page}`
        }
    };
}

export default function Layout({ children }) {
    return children;
}
