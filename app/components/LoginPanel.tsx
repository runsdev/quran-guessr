import React from 'react';

import Image from 'next/image';

/** Login form + decorative Quran image panel inside the bento grid. */
const LoginPanel = (): React.JSX.Element => (
  <div className="md:col-span-2 glass-panel rounded-3xl p-(--spacing-lg) flex flex-col md:flex-row items-center gap-(--spacing-xl)">
    <div className="w-full md:w-1/2 space-y-(--spacing-md)">
      <h2 className="text-2xl font-semibold text-on-surface">Continue Journey</h2>
      <p className="text-base text-on-surface-variant">
        Sign in to sync your progress across devices and climb the global leaderboards.
      </p>
      <form className="space-y-(--spacing-md)">
        <div className="space-y-1">
          <label className="text-sm font-medium tracking-wide text-on-surface-variant px-1">
            Email Address
          </label>
          <input
            className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container text-on-surface px-4 py-3 rounded-t-lg transition-colors outline-none"
            placeholder="student@knowledge.com"
            type="email"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium tracking-wide text-on-surface-variant px-1">
            Access Key
          </label>
          <input
            className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container text-on-surface px-4 py-3 rounded-t-lg transition-colors outline-none"
            placeholder="••••••••"
            type="password"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              className="rounded border-outline-variant bg-surface text-primary-container focus:ring-primary-container"
              type="checkbox"
            />
            <span className="text-sm font-medium text-on-surface-variant">Remember me</span>
          </label>
          <a className="text-sm font-medium text-primary hover:underline" href="#">
            Forgot access?
          </a>
        </div>
        <button
          className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl font-semibold active:scale-95 transition-transform"
          type="button"
        >
          Sign In
        </button>
      </form>
    </div>

    <div className="hidden md:block w-1/2 h-full min-h-75 rounded-2xl overflow-hidden relative">
      <Image
        className="absolute inset-0 w-full h-full object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2xsd6Gzg9iRdBDk3SItlpJFEdSMMCmTkEjeNQYEMsVQ40ZxSXypQ2o2I-CsB06Vwrg7-HGoCeSGoLNRt1IJPZsNF4GpyBV1L4SBLSm1rcK8iOYYG99E9OpjPxTnJQXwgpyvQflVL8WxquAnWYOpO_GeaFr4tr3Cl34aj-BdE4HwDDe-6zmi45gigh9jDi5BvtSa2dI-nyAWju5ckkLEfHhDD8ZzQX7TeiXd0WFKcpXywhT8NCgO0TEHtsR1Yt40elv-SrCwNwLEXi"
        alt="Open Quran with elegant calligraphy"
        fill
        unoptimized
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-white text-sm font-medium italic">
          &ldquo;Knowledge is a light that Allah casts into the heart.&rdquo;
        </p>
      </div>
    </div>
  </div>
);

export default LoginPanel;
