"use client";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Brand Visual Card */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 p-8 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
              <h4>Timaitha Exclusive</h4>
            </span>
            <h3 className="text-3xl font-black text-white mt-4 tracking-tight">
              Powered by Thunder Media Official
            </h3>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Built from the ground up to empower independent audio
              distribution, giving creators total sovereignty over their sound
              assets, media storage, and community reach.
            </p>
          </div>
        </div>

        {/* Right Side: Mission & Details */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Redefining independent sound delivery.
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Timaitha is more than just a streaming interface. It’s a
            precision-engineered ecosystem designed to cut through online echo
            chambers. Whether you&lsquo;re streaming fresh drops, managing
            high-fidelity tracks, or downloading direct audio files, Timaitha
            puts control back into the hands of the artist and the listener.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-2xl font-black text-indigo-400">100%</h4>
              <p className="text-xs text-slate-400 mt-1">Independent Control</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-2xl font-black text-indigo-400">HQ</h4>
              <p className="text-xs text-slate-400 mt-1">
                Cloud Audio Delivery
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
              <h4 className="text-2xl font-black text-indigo-400">Live</h4>
              <p className="text-xs text-slate-400 mt-1">Seamless Playback</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
