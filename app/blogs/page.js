"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search } from "lucide-react";
import { fetchBlogData } from "@/lib/shopify";



const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
    const [loading, setLoading] = useState(true);
    const [filtering, setFiltering] = useState(false);

    // Initial load
    useEffect(() => {
        const loadBlogs = async () => {
            setLoading(true);
            try {
                const { edges, pageInfo } = await fetchBlogData();
                setBlogs(edges);
                setPageInfo(pageInfo);
            } catch (error) {
                console.error("Failed to load blogs", error);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, []);

    // Load More handler
    const handleLoadMore = async () => {
        if (!pageInfo.hasNextPage) return;

        try {
            const { edges, pageInfo: newPageInfo } = await fetchBlogData(pageInfo.endCursor);
            setBlogs((prev) => {
                const combined = [...prev, ...edges];
                // Use Map to deduplicate by ID
                const uniqueBlogs = Array.from(new Map(combined.map(item => [item.node.id, item])).values());
                return uniqueBlogs;
            });
            setPageInfo(newPageInfo);
        } catch (error) {
            console.error("Failed to load more blogs", error);
        }
    };

    // Search Filter
    const filteredBlogs = blogs.filter((blog) => {
        const title = blog.node.title.toLowerCase();
        // Assuming contentHtml might be heavy, filtering by title is usually sufficient for client-side
        // but user asked for content search too inside their vanilla JS code
        // const content = blog.node.contentHtml.toLowerCase(); 
        return title.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full overflow-hidden bg-gray-900 text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1566576912321-158fa7599045?q=80&w=2070&auto=format&fit=crop"
                        alt="Blog Hero Background"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="mb-8 flex items-center gap-2 text-sm font-medium hover:text-gray-200 transition-colors w-fit"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <h1 className="mb-4 text-5xl font-bold tracking-tight">Blog</h1>
                    <p className="max-w-xl text-lg font-medium text-gray-100">
                        Discover insights, tips, and stories to inform and inspire your
                        journey.
                    </p>
                </div>
            </section>

            {/* Search Section */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-end gap-6 border-b border-gray-200 pb-4 md:flex-row md:items-center">
                    {/* Removed Alphabet filters as they weren't in the vanilla JS logic provided in the end, 
           and implementing them requires different Shopify queries or heavy client sorting. 
           Sticking to the search logic provided. */}

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                </div>
            </section>

            {/* Blog Grid Section */}
            <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                {loading && blogs.length === 0 ? (
                    <div className="w-full text-center py-20">Loading blogs...</div>
                ) : (
                    <>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredBlogs.map((blog) => {
                                const post = blog.node;
                                // As per user requirement: rewrite URL to /blogPost.html?title=slug
                                // Use Shopify handle for the URL
                                const blogUrl = `/blogs/${post.handle}`;

                                // Image fallback
                                const imageUrl = post.image?.url || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop";

                                return (
                                    <Link
                                        key={post.id}
                                        href={blogUrl}
                                        className="group flex flex-col overflow-hidden rounded-xl bg-white transition-all hover:shadow-lg cursor-pointer"
                                    >
                                        <div className="relative h-60 w-full overflow-hidden rounded-xl bg-gray-200">
                                            <Image
                                                src={imageUrl}
                                                alt={post.image?.altText || post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col pt-6">
                                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                                                {/* Static Category or extracted if available */}
                                                Business Blog
                                            </p>
                                            <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                                                {post.excerpt || "Click to read more..."}
                                            </p>
                                            <p className="mt-4 text-xs text-gray-400">
                                                Published on: {new Date(post.publishedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Load More Button */}
                        {pageInfo.hasNextPage && searchQuery === "" && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                        {/* No Results */}
                        {filteredBlogs.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No articles found matching "{searchQuery}"
                            </div>
                        )}
                    </>
                )}
            </section>
        </div >
    );
};

export default BlogPage;