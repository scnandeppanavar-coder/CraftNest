import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && subject && message) {
      setSubmitted(true);
      showToast('Message sent successfully! We will get back to you shortly.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } else {
      showToast('Please fill all fields', 'warning');
    }
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in-up">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="font-outfit font-black text-3xl sm:text-4xl text-secondary-900 dark:text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm text-secondary-400 dark:text-secondary-500">
          Have questions about shipping, customized pieces, or interested in showcasing your crafts? Drop us a note!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 p-6 rounded-3xl shadow-sm transition-colors flex items-start gap-4">
            <span className="p-3 bg-primary-100 dark:bg-primary-950/40 text-primary-500 rounded-2xl shrink-0">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-outfit font-bold text-base text-secondary-900 dark:text-white mb-1">Our Workshop</h4>
              <p className="text-xs text-secondary-550 dark:text-secondary-400 leading-relaxed">
                123 Crafts Lane, Malviya Nagar,<br /> Jaipur, Rajasthan - 302017, India
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 p-6 rounded-3xl shadow-sm transition-colors flex items-start gap-4">
            <span className="p-3 bg-primary-100 dark:bg-primary-950/40 text-primary-500 rounded-2xl shrink-0">
              <Phone className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-outfit font-bold text-base text-secondary-900 dark:text-white mb-1">Call Us</h4>
              <p className="text-xs text-secondary-555 dark:text-secondary-400 leading-relaxed">
                +91 98765 43210<br />
                Mon - Sat: 9:00 AM to 6:00 PM IST
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 p-6 rounded-3xl shadow-sm transition-colors flex items-start gap-4">
            <span className="p-3 bg-primary-100 dark:bg-primary-950/40 text-primary-500 rounded-2xl shrink-0">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-outfit font-bold text-base text-secondary-900 dark:text-white mb-1">Email Us</h4>
              <p className="text-xs text-secondary-555 dark:text-secondary-400 leading-relaxed">
                support@craftnest.com<br />
                info@craftnest.com
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3 bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6">
          <h3 className="font-outfit font-bold text-lg text-secondary-900 dark:text-white border-b border-secondary-100 dark:border-secondary-800 pb-3">
            Send Message
          </h3>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-3">
              <MessageSquareCheck className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="font-outfit font-bold text-emerald-800 dark:text-emerald-400">Thank you!</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Your message has been delivered. Our artisan care team will review and reply within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="How can we help you?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 font-bold text-sm text-white bg-primary-500 hover:bg-primary-600 active:scale-95 rounded-2xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Send Message <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Google Map Placeholder */}
      <section className="space-y-4">
        <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white">Our Workshop Location</h3>
        <div className="relative aspect-video lg:aspect-3/1 bg-secondary-200 dark:bg-secondary-800 rounded-3xl border border-secondary-300 dark:border-secondary-700 shadow-inner overflow-hidden flex flex-col items-center justify-center text-center p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,122,87,0.1),transparent)] pointer-events-none" />
          <MapPin className="w-12 h-12 text-primary-500 mb-2 animate-bounce" />
          <h4 className="font-outfit font-bold text-secondary-900 dark:text-white">CraftNest Workshop Map</h4>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 max-w-sm">
            Interactive map loading simulated. Located at the heart of handicrafts production in Jaipur, Rajasthan, India.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
