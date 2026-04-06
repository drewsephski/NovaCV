'use client';

import Link from 'next/link';
import { TopMenu } from '../components/TopMenu';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Upload } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a]">
      <TopMenu />

      {/* Hero Section - Editorial Layout */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 min-h-[85vh] items-center">
            
            {/* Left Column - Typography */}
            <div className="lg:col-span-5 flex flex-col justify-center py-16 lg:py-0 order-2 lg:order-1">
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
                <Link href="/upload">
                  <button className="group inline-flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] text-white text-sm tracking-wide hover:bg-[#333] transition-colors duration-300">
                    Upload Resume
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                  </button>
                </Link>
                
              </motion.div>

              {/* Stats - Minimal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-12 mt-16 pt-8 border-t border-[#e5e5e5]"
              >
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
            <div className="lg:col-span-7 flex items-center justify-center lg:justify-end py-8 lg:py-0 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-xl"
              >
                {/* Image container with subtle shadow */}
                <div className="relative shadow-[0_4px_40px_-12px_rgba(0,0,0,0.015)]">
                  <img
                    src="/cv-home.png"
                    className="w-full h-auto"
                    alt="Portfolio preview"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Statement - Editorial Style */}
      <section className="py-32 lg:py-40">
        <div className="max-w-5xl mx-auto px-8 md:px-16">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl lg:text-[2.75rem] font-light leading-[1.3] tracking-tight text-[#1a1a1a] text-center"
          >
            Transform your professional presence with a website that reflects your unique experience.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl lg:text-[2.75rem] font-light leading-[1.3] tracking-tight text-[#666] text-center mt-4"
          >
            Stand out from the crowd with a personalized portfolio that tells your story.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-px bg-[#ccc] mx-auto mt-16 origin-center"
          />
        </div>
      </section>

      {/* How it Works - Clean List */}
      <section className="py-20 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { num: '01', title: 'Upload', desc: 'PDF or LinkedIn export' },
              { num: '02', title: 'Generate', desc: 'AI extracts and designs' },
              { num: '03', title: 'Share', desc: 'Custom URL ready instantly' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col"
              >
                <span className="text-xs text-[#999] mb-3">{step.num}</span>
                <h3 className="text-xl font-normal mb-2">{step.title}</h3>
                <p className="text-sm text-[#666]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-8 md:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-light mb-6"
          >
            Ready for your new portfolio?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-[#888] mb-10"
          >
            Join professionals who have elevated their online presence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link href="/upload">
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1a1a1a] text-sm tracking-wide hover:bg-[#f0f0f0] transition-colors duration-300">
                <Upload className="h-4 w-4" strokeWidth={1.5} />
                Create Your Portfolio
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
