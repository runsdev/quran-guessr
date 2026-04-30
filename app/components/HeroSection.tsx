import React from 'react';

/**
 * Hero section for the home page — headline, subtitle, and CTA buttons.
 */
const HeroSection = (): React.JSX.Element => (
  <section className="relative overflow-hidden px-(--spacing-margin) py-(--spacing-xl) md:py-32 flex flex-col items-center">
    {/* Gradient backdrop */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGiurZGXWIzFbttn6-t-LPuJOaW3d_279_qF4JB_SBuYMBpLTOsZfVaKYVmmin240WBKt1i1uYQJMbm_JsRew-_cLj9pf7TudNUXJwcEcz4SAPnJe-wgTACjfUIJvvQ77Bt2-5MEKj9zydXJEzma6z-I1kLmDEYXDuyi2SsxdQ5X9N9JdZGrAVlHOLiA1DzAZPX52t4tRfVh1Z2NQiH-Z7PZIiC5Uu-MNoZTi33OTpjJd_HCZU9K11UjkLEqyUMR-eZ1UIkirbYyK6"
          alt=""
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-4xl w-full text-center space-y-(--spacing-lg)">
      {/* Badge */}
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary text-sm mb-(--spacing-xs)">
        <span className="material-symbols-outlined text-[18px] mr-2">stars</span>
        Newly Updated Challenges
      </div>

      <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-on-surface leading-tight">
        Master the <span className="text-primary">Holy Quran</span> Through Interactive Learning
      </h1>

      <p className="text-lg leading-7 text-on-surface-variant max-w-2xl mx-auto">
        Challenge yourself with verse identification, word meanings, and surah sequences. A
        meditative journey for the modern student of knowledge.
      </p>

      <div className="flex flex-col sm:flex-row gap-(--spacing-gutter) justify-center items-center pt-(--spacing-md)">
        <button className="w-full sm:w-auto px-(--spacing-xl) py-(--spacing-md) bg-primary-container text-on-primary-container rounded-xl font-semibold active:scale-95 transition-all shadow-lg">
          Start Learning
        </button>
        <button className="w-full sm:w-auto px-(--spacing-xl) py-(--spacing-md) border border-primary text-primary rounded-xl font-semibold active:scale-95 transition-all hover:bg-primary/5">
          View Rankings
        </button>
      </div>
    </div>
  </section>
);

export default HeroSection;
