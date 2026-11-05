import CmsLink from "./CmsLink";

/** Optional site-wide announcement bar (Website Settings → Announcement bar). Off by default. */
export default function AnnouncementBar({ announcement }) {
  if (!announcement?.enabled || !announcement.text) return null;
  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-primary text-white text-center text-xs md:text-sm py-1 px-4">
      <span>{announcement.text}</span>
      {announcement.link && (
        <CmsLink link={announcement.link} className="underline font-semibold ms-2" />
      )}
    </div>
  );
}
