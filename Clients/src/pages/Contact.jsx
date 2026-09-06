import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import { useToast } from '../components/ToastContext';

function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Thank you! Your message has been sent.', 'success');
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 placeholder:text-gray-400";

  return (
    <PageTransition>
      <div className="font-sans min-h-[calc(100vh-4rem)]" style={{ background: 'linear-gradient(135deg, #F2F7F2 0%, #FAF9F6 45%, #F7F2EB 100%)' }}>
        {/* Hero banner (matches Home page bright cream/sand theme) */}
        <section className="relative text-center py-12 sm:py-16 px-4 sm:px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F8F6F3 0%, #F4F2EB 40%, #E8F0E8 80%, #F4EDE3 100%)' }}>
          <div className="blob-float absolute -top-16 -left-10 w-64 h-64 rounded-full bg-[#7E9B7A]/15 blur-3xl pointer-events-none" />
          <div className="blob-float absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none" style={{ animationDelay: '4s' }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-[#3E5F48]/10 border border-[#3E5F48]/20 text-[#3E5F48] text-xs font-bold px-3.5 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-4 uppercase tracking-wider backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E5F48] animate-pulse" />
              Get in Touch
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1F2D23] mb-2 sm:mb-3 tracking-tight">We'd Love to Hear From You</h1>
            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Questions, feedback, or interest in partnering with FoodBridge? Send us a message!
            </p>
          </div>
          {/* Wave divider */}
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"
            className="absolute bottom-0 left-0 w-full h-8 sm:h-10 md:h-12 pointer-events-none">
            <path d="M0,80 C360,30 720,110 1440,50 L1440,120 L0,120 Z" fill="#F8F6F3" />
          </svg>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info cards */}
            <div className="flex flex-col gap-4">
              <div className="card-hover bg-white border border-[#E7E5E0] shadow-fb-card rounded-[20px] p-6">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                  <span className="text-xl">📧</span>
                </div>
                <h3 className="font-bold text-[#1F2D23] text-base mb-1">Email Us</h3>
                <p className="text-[#6B7280] text-sm">hello@foodbridge.com</p>
                <p className="text-xs text-[#8A8F87] mt-2">We typically reply within 24 hours.</p>
              </div>

              <div className="card-hover bg-white border border-[#E7E5E0] shadow-fb-card rounded-[20px] p-6">
                <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center mb-3">
                  <span className="text-xl">🍽️</span>
                </div>
                <h3 className="font-bold text-[#1F2D23] text-base mb-1">For Restaurants</h3>
                <p className="text-[#6B7280] text-sm mb-3">Want to list surplus food? Register from the homepage to get started.</p>
                <Link to="/restaurant?mode=register" className="text-xs text-[#3E5F48] font-semibold hover:underline">
                  Join as Restaurant →
                </Link>
              </div>

              <div className="card-hover bg-white border border-[#E7E5E0] shadow-fb-card rounded-[20px] p-6">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                  <span className="text-xl">🤝</span>
                </div>
                <h3 className="font-bold text-[#1F2D23] text-base mb-1">For NGOs</h3>
                <p className="text-[#6B7280] text-sm mb-3">Looking to receive food donations? Sign up as an NGO to start claiming listings.</p>
                <Link to="/ngo?mode=register" className="text-xs text-[#D9A441] font-semibold hover:underline">
                  Join as NGO →
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-[#E7E5E0] shadow-fb-card rounded-[20px] p-6 md:p-8 flex flex-col justify-center">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4 text-2xl">
                    🎉
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2">Message Sent!</h3>
                  <p className="text-ink-soft text-sm mb-6">Thank you for reaching out. We will get back to you shortly.</p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-ink mb-1">Send a Message</h2>
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full mt-2">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default Contact;
