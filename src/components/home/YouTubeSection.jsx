import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import { SITE } from '@/config/site';
import { getYouTubeEmbedUrl } from '@/utils/helpers';

export default function YouTubeSection({ url = SITE.youtubeUrl }) {
  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Watch" title="Style In Motion" subtitle="Take a look at our latest collection and store." />
        <Reveal className="mx-auto max-w-5xl">
          <div className="relative aspect-video w-full overflow-hidden bg-primary shadow-2xl">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${SITE.name} video`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <Icon name="play" className="h-16 w-16 text-accent" />
                <p className="mt-4 font-display text-xl">Video Coming Soon</p>
                <p className="mt-1 text-xs text-gray-400">Set VITE_YOUTUBE_URL in your .env file</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
