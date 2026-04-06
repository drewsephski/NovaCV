'use client';

import Link from 'next/link';
import { TopMenu } from '../components/TopMenu';
import { Footer } from '../components/Footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Upload, Sparkles, Zap, Globe } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { LineDecoration, DotGrid, FloatingElement, CornerAccent } from '@/components/motion/Decorations';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { useRef } from 'react';

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const steps = [
    { num: '01', title: 'Upload', desc: 'PDF or LinkedIn export', icon: Upload },
    { num: '02', title: 'Generate', desc: 'AI extracts and designs', icon: Sparkles },
    { num: '03', title: 'Share', desc: 'Custom URL ready instantly', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a] overflow-x-hidden">
      <TopMenu />

      {/* Hero Section - Editorial Layout */}
      <section ref={heroRef} className="relative min-h-screen">
        {/* Decorative elements */}
        <div className="absolute top-32 left-8 md:left-16 lg:left-24 opacity-40">
          <DotGrid rows={4} cols={4} gap={20} dotSize={2} />
        </div>

        <motion.div
          className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 min-h-[85vh] items-center">
            {/* Left Column - Typography */}
            <div className="lg:col-span-5 flex flex-col justify-center py-16 lg:py-0 order-2 lg:order-1 relative">
              <CornerAccent position="top-left" size={60} className="-top-4 -left-4" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-xs uppercase tracking-[0.2em] text-[#666] mb-6 block">
                  Professional Portfolio Generator
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl lg:text-[4.5rem] font-light leading-[0.95] tracking-tight mb-8"
              >
                Your resume,
                <br />
                <span className="font-normal italic">reimagined.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg text-[#555] leading-relaxed max-w-md mb-10"
              >
                Upload your LinkedIn PDF. Get a refined, professional website
                in seconds. No templates. No generic designs.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-6"
              >
                <EnhancedButton href="/upload" size="lg" icon={ArrowRight}>
                  Upload Resume
                </EnhancedButton>
              </motion.div>

              {/* Stats - Minimal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-12 mt-16 pt-8 relative"
              >
                <div className="absolute top-0 left-0 right-0">
                  <LineDecoration animated={false} />
                </div>
                <div>
                  <p className="text-2xl font-light text-[#1a1a1a]">10k+</p>
                  <p className="text-xs text-[#888] mt-1">Portfolios created</p>
                </div>
                <div>
                  <p className="text-2xl font-light text-[#1a1a1a]">&lt;30s</p>
                  <p className="text-xs text-[#888] mt-1">Average build time</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Preview Image */}
            <div className="lg:col-span-7 flex items-center justify-center lg:justify-end py-8 lg:py-0 order-1 lg:order-2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-xl"
              >
                {/* Floating accent */}
                <FloatingElement
                  className="absolute -top-8 -right-8 z-10"
                  amplitude={15}
                  duration={5}
                >
                  <div className="w-16 h-16 border border-[#1a1a1a]/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-[#1a1a1a]/40" strokeWidth={1} />
                  </div>
                </FloatingElement>

                {/* Image container with subtle shadow */}
                <div className="relative shadow-[0_4px_60px_-12px_rgba(0,0,0,0.08)]">
                  <img
                    src="/cv-home.png"
                    className="w-full h-auto"
                    alt="Portfolio preview"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Statement - Editorial Style */}
      <section className="py-32 lg:py-40 relative">
        <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-30 hidden lg:block">
          <DotGrid rows={6} cols={3} gap={32} dotSize={3} />
        </div>

        <div className="max-w-5xl mx-auto px-8 md:px-16">
          <ScrollReveal delay={0}>
            <p className="text-2xl sm:text-3xl lg:text-[2.75rem] font-light leading-[1.3] tracking-tight text-[#1a1a1a] text-center">
              Transform your professional presence with a website that reflects your unique experience.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="text-2xl sm:text-3xl lg:text-[2.75rem] font-light leading-[1.3] tracking-tight text-[#666] text-center mt-4">
              Stand out from the crowd with a personalized portfolio that tells your story.
            </p>
          </ScrollReveal>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-px bg-[#ccc] mx-auto mt-16 origin-center"
          />
        </div>
      </section>

      {/* How it Works - Clean List */}
      <section className="py-20 border-t border-[#e5e5e5] relative">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="flex flex-col group cursor-default"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs text-[#999] font-mono">{step.num}</span>
                    <div className="h-px flex-1 bg-[#e5e5e5] group-hover:bg-[#ccc] transition-colors duration-300" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="h-5 w-5 text-[#666] group-hover:text-[#1a1a1a] transition-colors duration-300" strokeWidth={1.5} />
                    <h3 className="text-xl font-normal">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[#666]">{step.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#f5f5f5]/50">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <ScrollReveal className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[#666] mb-4 block">
              Why choose us
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
              Built for <span className="font-normal italic">professionals</span>
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'AI-Powered', desc: 'Intelligent extraction and design that adapts to your content', icon: Zap },
              { title: 'Instant Deploy', desc: 'Your site is live in seconds with a custom URL', icon: Globe },
              { title: 'Always Updated', desc: 'Redeploy anytime with new versions of your resume', icon: Sparkles },
            ].map((feature, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="p-6 bg-white border border-[#e5e5e5] group hover:border-[#ccc] transition-all duration-300"
                  whileHover={{ y: -4, boxShadow: '0 8px 30px -10px rgba(0,0,0,0.08)' }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="h-5 w-5 text-[#666] mb-4 group-hover:text-[#1a1a1a] transition-colors duration-300" strokeWidth={1.5} />
                  <h3 className="text-lg font-normal mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed">{feature.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="absolute top-1/4 left-8 opacity-20">
          <DotGrid rows={4} cols={4} gap={24} dotSize={2} color="rgba(255,255,255,0.3)" />
        </div>
        <div className="absolute bottom-1/4 right-8 opacity-20">
          <DotGrid rows={4} cols={4} gap={24} dotSize={2} color="rgba(255,255,255,0.3)" />
        </div>

        <div className="max-w-4xl mx-auto px-8 md:px-16 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-light mb-6">
              Ready for your new portfolio?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-[#888] mb-10">
              Join professionals who have elevated their online presence.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Link href="/upload">
              <motion.button
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1a1a1a] text-sm tracking-wide hover:bg-[#f0f0f0] transition-colors duration-300"
              >
                <Upload className="h-4 w-4" strokeWidth={1.5} />
                Create Your Portfolio
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
