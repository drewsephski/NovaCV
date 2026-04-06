import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TopMenu } from '../components/TopMenu';
import { Footer } from '../components/Footer';
import { BlurFade } from '@/components/ui/BlurFade';

export default function Home() {
  return (
    <>
      <TopMenu />

      <section className="flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col min-h-[80vh] relative z-10">
          {/* Main content */}
          <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto items-center px-6 md:px-12 py-12 lg:py-0 gap-12 lg:gap-16">
            {/* Left side - Call to action */}
            <div className="w-full lg:w-[50%] flex flex-col justify-center items-center lg:items-start">
              <div className="max-w-lg text-center lg:text-left">
                <BlurFade delay={0.1}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-muted-foreground text-sm mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white/60" />
                    </span>
                    100% free & open source
                  </div>
                </BlurFade>

                <BlurFade delay={0.2}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
                    Turn your
                    <span className="gradient-text"> LinkedIn</span>
                    <br className="hidden sm:block" />
                    {' '}into a website
                    <br className="hidden sm:block" />
                    <span className="text-muted-foreground">instantly</span>
                  </h1>
                </BlurFade>

                <BlurFade delay={0.3}>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
                    Upload your resume or LinkedIn PDF and get a beautiful,
                    professional website in seconds.
                  </p>
                </BlurFade>

                <BlurFade delay={0.4}>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <Link href="/upload">
                      <button className="group relative inline-flex items-center justify-center gap-2 h-9 px-5 text-sm font-medium text-black bg-white rounded-md overflow-hidden transition-all duration-200 ease-out hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]">
                        <svg
                          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        Upload Resume
                      </button>
                    </Link>
                  </div>
                </BlurFade>

                <BlurFade delay={0.5}>
                  <p className="text-sm text-muted-foreground/60 mt-6">
                    Takes less than a minute
                  </p>
                </BlurFade>
              </div>
            </div>

            {/* Right side - Preview */}
            <div className="w-full lg:w-[50%] flex justify-center items-center relative">
              <BlurFade delay={0.35} className="w-full">
                <div className="relative">
                  {/* Decorative glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/[0.03] rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl" />

                  {/* Main image container */}
                  <div className="relative bg-card rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 glow-subtle">
                    <img
                      src="/cv-home.png"
                      className="w-full h-auto object-cover"
                      alt="CV Website Preview"
                    />

                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -right-4 lg:right-8 bg-card rounded-lg border border-white/10 p-3 flex items-center gap-3 animate-fade-in-up shadow-xl" style={{ animationDelay: '0.6s' }}>
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">AI Generated</p>
                      <p className="text-xs text-muted-foreground">In seconds</p>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="relative z-10 border-t border-white/[0.06] bg-white/[0.01]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
            <BlurFade>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M12 18v-6" />
                        <path d="M9 15l3-3 3 3" />
                      </svg>
                    ),
                    title: 'PDF Upload',
                    description: 'Simply upload your LinkedIn PDF or resume and we handle the rest.',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" x2="21" y1="9" y2="9" />
                        <line x1="9" x2="9" y1="21" y2="9" />
                      </svg>
                    ),
                    title: 'Beautiful Design',
                    description: 'Get a professionally designed website that showcases your experience.',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" x2="22" y1="12" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    ),
                    title: 'Instant Share',
                    description: 'Get a custom URL to share your professional profile with anyone.',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-white/[0.05] rounded-lg flex items-center justify-center text-white/70 mb-4 border border-white/[0.08] group-hover:border-white/20 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
