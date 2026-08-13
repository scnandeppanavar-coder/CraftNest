import React from 'react';
import { Compass, Sparkles, HeartHandshake, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16 pb-16 animate-fade-in-up">
      {/* Hero / Header */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-950 to-secondary-950 py-16 px-8 sm:px-12 text-center text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,122,87,0.12),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Our Legacy
          </span>
          <h1 className="font-outfit font-black text-3xl sm:text-5xl tracking-tight">
            Connecting Hearts Through Crafts
          </h1>
          <p className="text-sm text-secondary-300 leading-relaxed">
            Founded with a vision to preserve indigenous craftsmanship, CraftNest bridges the gap between traditional creators and design collectors globally.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl text-secondary-900 dark:text-white tracking-tight">
            Our Story & Journey
          </h2>
          <div className="space-y-4 text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
            <p>
              CraftNest started in a tiny workshop in Jaipur, India. We observed brilliant potters, weavers, and woodworkers struggling to reach wider audiences beyond local weekly bazaars. Their age-old techniques, handed down across generations, were facing neglect in a world dominated by mass factory production.
            </p>
            <p>
              We realized that e-commerce could provide a permanent digital canvas for these unique handcrafts. By offering a platform that connects collectors directly with independent artisans, we guarantee fair trade pricing and support sustainable local economies.
            </p>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-secondary-200/50 dark:border-secondary-800 shadow-lg aspect-video">
          <img
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
            alt="Ceramic Pottery Shaping"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="p-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl space-y-4 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-500 rounded-2xl flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-outfit font-bold text-lg text-secondary-900 dark:text-white">Our Mission</h3>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
            To empower independent creators by providing a reliable digital storefront, promoting fair compensation, and preserving heritage handcrafted arts.
          </p>
        </div>

        <div className="p-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl space-y-4 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-500 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-outfit font-bold text-lg text-secondary-900 dark:text-white">Our Vision</h3>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
            To become the premier global destination for authentic rustic luxury, building a thriving community of artisans and design enthusiasts.
          </p>
        </div>

        <div className="p-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl space-y-4 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-500 rounded-2xl flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-outfit font-bold text-lg text-secondary-900 dark:text-white">Our Values</h3>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
            Transparency, sustainability, quality, and respect. We are dedicated to supporting traditional processes and eco-friendly packaging materials.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
