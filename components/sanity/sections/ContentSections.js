import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";
import Link from "@/components/AppLink";
import RichText from "../RichText";
import CmsLink from "../CmsLink";
import { fileUrl, imageAlt, imageUrl } from "@/sanity/lib/image";
import { safeHref, visibleLinks } from "@/sanity/lib/links";

const SECTION_PAD = "px-6 md:px-12 lg:px-20";

const BUTTON_STYLES = {
  primary: "bg-primary text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors",
  outline: "border-2 border-black rounded-lg font-bold py-3 px-8 hover:bg-black hover:text-white transition-colors",
  default: "bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors",
};

function Buttons({ links, light = false }) {
  const items = visibleLinks(links);
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-4 pt-2">
      {items.map((link) => (
        <CmsLink
          key={link._key || link.label}
          link={link}
          className={`${BUTTON_STYLES[link.variant] || BUTTON_STYLES.default} ${light && link.variant === "outline" ? "border-white hover:bg-white hover:text-black" : ""}`}
        />
      ))}
    </div>
  );
}

/** Black banner used by the policy pages (Privacy / Terms). */
export function PageHeader({ section }) {
  const bg = imageUrl(section.backgroundImage, { width: 1920 });
  const backHref = safeHref(section.backPath);
  return (
    <div className="bg-black h-[40vh] flex items-center text-white py-12 px-10 sm:px-10 lg:px-20 relative overflow-hidden">
      {bg && <Image src={bg} alt={imageAlt(section.backgroundImage)} fill className="object-cover opacity-40" sizes="100vw" />}
      <div className="w-full relative">
        {backHref && section.backLabel && (
          <Link href={backHref} className="flex w-fit cursor-pointer items-center gap-2 text-white hover:text-gray-300 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">{section.backLabel}</span>
          </Link>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light">{section.heading}</h1>
      </div>
    </div>
  );
}

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
};

/** Policy body: dates, intro and numbered sections. Matches the original legal page layout. */
export function LegalContent({ section }) {
  const effective = formatDate(section.effectiveDate);
  const updated = formatDate(section.lastUpdated);
  return (
    <div className="lg:w-[70%] px-10 sm:px-10 lg:px-20 py-12 sm:py-16">
      {(effective || updated) && (
        <div className="mb-8 space-y-1">
          {effective && (
            <p className="text-gray-800 text-base sm:text-lg">
              {section.effectiveLabel || "Effective Date"} : {effective}
            </p>
          )}
          {updated && (
            <p className="text-gray-800 text-base sm:text-lg">
              {section.updatedLabel || "Last Updated"} : {updated}
            </p>
          )}
        </div>
      )}

      <RichText value={section.intro} strongClass="font-medium" className="mb-12 [&>*:last-child]:mb-0" />

      {(section.sections || []).map((item) => (
        <section key={item._key || item.heading} className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">{item.heading}</h2>
          <RichText value={item.body} />
          {item.contactLines?.length > 0 && (
            <div className="space-y-3 ml-4 sm:ml-6 mt-4">
              {item.contactLines.map((line) => (
                <div key={line._key || line.text} className="flex items-start gap-2">
                  {line.icon && <span className="text-red-500 text-lg">{line.icon}</span>}
                  <p className="text-gray-700 text-base sm:text-lg">{line.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export function RichTextBlock({ section }) {
  return (
    <section className={`${SECTION_PAD} py-12 md:py-16`}>
      <div className="lg:w-[70%]">
        {section.heading && <h2 className="text-3xl md:text-4xl lg:text-5xl mb-8">{section.heading}</h2>}
        <RichText value={section.body} />
      </div>
    </section>
  );
}

export function ImageWithText({ section }) {
  const src = imageUrl(section.image, { width: 1200 });
  const imageLeft = section.imagePosition === "left";
  return (
    <section className={`${SECTION_PAD} py-12 md:py-20`}>
      <div className={`flex flex-col gap-10 md:items-center ${imageLeft ? "md:flex-row-reverse" : "md:flex-row"}`}>
        <div className="md:w-1/2 space-y-4">
          {section.subheading && <p className="text-sm font-bold uppercase tracking-wider text-blue-600">{section.subheading}</p>}
          {section.heading && <h2 className="text-3xl md:text-4xl lg:text-5xl">{section.heading}</h2>}
          <RichText value={section.body} />
          <Buttons links={section.buttons} />
        </div>
        {src && (
          <div className="md:w-1/2 relative h-72 md:h-[28rem] rounded-xl overflow-hidden">
            <Image src={src} alt={imageAlt(section.image)} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        )}
      </div>
    </section>
  );
}

export function Gallery({ section }) {
  const images = (section.images || []).filter((i) => imageUrl(i));
  if (!images.length) return null;
  return (
    <section className={`${SECTION_PAD} py-12 md:py-16`}>
      {section.heading && <h2 className="text-3xl md:text-4xl lg:text-5xl text-center pb-10">{section.heading}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <figure key={img._key} className="relative h-64 rounded-lg overflow-hidden shadow-md group">
            <Image src={imageUrl(img, { width: 900 })} alt={imageAlt(img)} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            {img.caption && (
              <figcaption className="absolute bottom-0 inset-x-0 p-3 text-white text-sm bg-gradient-to-t from-black/70 to-transparent">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Stats({ section }) {
  const items = section.items || [];
  if (!items.length) return null;
  return (
    <section className={`${SECTION_PAD} py-12 md:py-16`}>
      {section.heading && <h2 className="text-3xl md:text-4xl lg:text-5xl text-center pb-10">{section.heading}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((s) => (
          <div key={s._key || s.label}>
            <p className="text-4xl md:text-5xl font-bold text-gray-900">{s.value}</p>
            {s.label && <p className="text-gray-600 mt-2">{s.label}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CallToAction({ section }) {
  const bg = imageUrl(section.backgroundImage, { width: 1920 });
  return (
    <section className={`relative overflow-hidden ${bg ? "text-white" : "bg-gray-50"} ${SECTION_PAD} py-16 md:py-24`}>
      {bg && (
        <>
          <Image src={bg} alt={imageAlt(section.backgroundImage)} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}
      <div className="relative max-w-3xl mx-auto text-center space-y-6">
        {section.heading && <h2 className="text-3xl md:text-4xl lg:text-5xl">{section.heading}</h2>}
        {section.description && <p className="text-lg opacity-90">{section.description}</p>}
        <div className="flex justify-center">
          <Buttons links={section.buttons} light={Boolean(bg)} />
        </div>
      </div>
    </section>
  );
}

function embedUrl(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function Video({ section }) {
  const file = fileUrl(section.videoFile);
  const url = safeHref(section.videoUrl);
  const embed = !file && url ? embedUrl(url) : null;
  const src = file || url;
  if (!src) return null;
  return (
    <section className={`${SECTION_PAD} py-12 md:py-16`}>
      {section.heading && <h2 className="text-3xl md:text-4xl lg:text-5xl text-center pb-10">{section.heading}</h2>}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        {embed ? (
          <iframe src={embed} className="absolute inset-0 w-full h-full border-0" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" title={section.heading || "Video"} />
        ) : (
          <video className="absolute inset-0 w-full h-full object-cover" src={src} poster={imageUrl(section.poster, { width: 1600 }) || undefined} controls playsInline />
        )}
      </div>
    </section>
  );
}

export function LogoShowcase({ section }) {
  const logos = (section.logos || []).filter((l) => imageUrl(l.image));
  if (!logos.length) return null;
  return (
    <section className={`${SECTION_PAD} py-12 md:py-16`}>
      {section.heading && <h2 className="text-3xl md:text-4xl text-center pb-10">{section.heading}</h2>}
      <div className="flex flex-wrap justify-center items-center gap-10">
        {logos.map((logo) => {
          const img = (
            <Image src={imageUrl(logo.image, { width: 320 })} alt={imageAlt(logo.image, logo.name || "")} width={160} height={80} className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition" />
          );
          const href = safeHref(logo.url);
          return href ? (
            <a key={logo._key} href={href} target="_blank" rel="noopener noreferrer">{img}</a>
          ) : (
            <div key={logo._key}>{img}</div>
          );
        })}
      </div>
    </section>
  );
}

export function Testimonials({ section }) {
  const items = (section.items || []).filter((t) => t && !t.hidden && t.quote);
  if (!items.length) return null;
  return (
    <section className={`${SECTION_PAD} py-12 md:py-20`}>
      {section.heading && <h2 className="text-3xl md:text-4xl lg:text-5xl text-center pb-10">{section.heading}</h2>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => {
          const photo = imageUrl(t.image, { width: 160, height: 160 });
          return (
            <figure key={t._key || t.name} className="rounded-xl shadow-md p-6 bg-white flex flex-col gap-4">
              {t.rating > 0 && (
                <div className="flex gap-1 text-yellow-500">
                  {Array.from({ length: Math.min(5, t.rating) }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              )}
              <blockquote className="text-gray-700 leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="flex items-center gap-3 mt-auto">
                {photo && <Image src={photo} alt={imageAlt(t.image, t.name)} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />}
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  {t.designation && <p className="text-sm text-gray-500">{t.designation}</p>}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

export function ContactInfo({ section, settings }) {
  const mapUrl = safeHref(section.mapEmbedUrl);
  return (
    <section className={`${SECTION_PAD} py-12 md:py-16`}>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 space-y-4">
          {section.heading && <h2 className="text-3xl md:text-4xl lg:text-5xl">{section.heading}</h2>}
          {section.description && <p className="text-gray-600 text-lg">{section.description}</p>}
          <div className="space-y-3 text-gray-700 text-base sm:text-lg">
            {settings?.contactEmail && (
              <p>📧 <a className="hover:underline" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p>
            )}
            {settings?.phone && (
              <p>📞 <a className="hover:underline" href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a></p>
            )}
            {settings?.address?.displayText && <p>📍 {settings.address.displayText}</p>}
          </div>
        </div>
        {mapUrl && (
          <div className="md:w-1/2 w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-sm border border-gray-100 relative bg-gray-100">
            <iframe src={mapUrl} className="absolute inset-0 w-full h-full border-0" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
      </div>
    </section>
  );
}
