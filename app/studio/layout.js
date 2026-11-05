// The Studio has its own root layout so it renders without the site's navbar, footer and scripts.
export default function StudioLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
