import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Map,
  ShieldCheck,
  Users,
  TrendingUp,
  Globe,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  Clock,
  Award,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthDialog from '@/components/AuthDialog';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Map,
      title: t('features.map.title'),
      description: t('features.map.description'),
      color: 'bg-indigo-500',
      delay: '0s'
    },
    {
      icon: TrendingUp,
      title: t('features.routes.title'),
      description: t('features.routes.description'),
      color: 'bg-emerald-500',
      delay: '0.1s'
    },
    {
      icon: Users,
      title: t('features.community.title'),
      description: t('features.community.description'),
      color: 'bg-amber-500',
      delay: '0.2s'
    },
    {
      icon: Award,
      title: t('features.insights.title'),
      description: t('features.insights.description'),
      color: 'bg-blue-500',
      delay: '0.3s'
    }
  ];

  const metrics = [
    { label: 'Cities Covered', value: '50+', icon: Globe },
    { label: 'Safety Signals', value: '100K+', icon: ShieldCheck },
    { label: 'Community Members', value: '500K+', icon: Users },
    { label: 'Safe Routes Daily', value: '1M+', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-heading font-black tracking-tight">
                Lumina
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate('/map')}
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                data-testid="nav-map-link"
              >
                {t('nav.map')}
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                data-testid="nav-privacy-link"
              >
                {t('footer.privacy')}
              </button>

              {/* Language Selector */}
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="text-sm border border-slate-200 rounded-full px-3 py-1.5 bg-white"
                data-testid="language-selector"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>

              <Button
                onClick={() => setShowAuth(true)}
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-6 font-semibold"
                data-testid="nav-login-button"
              >
                {t('nav.login')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white" data-testid="mobile-menu">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => {
                  navigate('/map');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {t('nav.map')}
              </button>
              <button
                onClick={() => {
                  navigate('/privacy');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {t('footer.privacy')}
              </button>
              <Button
                onClick={() => {
                  setShowAuth(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-full bg-indigo-600"
              >
                {t('nav.login')}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-white mb-6 tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
            <Button
              onClick={() => navigate('/map')}
              size="lg"
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all"
              data-testid="hero-cta-button"
            >
              {t('hero.cta')}
              <ChevronRight className="ml-2" size={20} />
            </Button>
            <Button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="rounded-full border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg font-bold transition-all"
              data-testid="hero-secondary-cta"
            >
              {t('hero.secondaryCta')}
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 text-center"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <metric.icon className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                <div className="text-3xl font-heading font-black text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-black text-slate-900 mb-4 tracking-tight">
              Powered by Community Intelligence
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real-time safety insights from the community, for the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="feature-card group bg-white border border-slate-200 rounded-3xl p-8 cursor-pointer"
                style={{ animationDelay: feature.delay }}
                data-testid={`feature-card-${idx}`}
              >
                <div
                  className={`${feature.color} h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-2 mb-6">
                <Lock size={16} />
                <span className="text-sm font-semibold">Privacy by Design</span>
              </div>
              <h2 className="text-4xl font-heading font-black text-slate-900 mb-6 tracking-tight">
                Zero PII Collection. Complete Transparency.
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Your safety matters, and so does your privacy. Lumina collects zero personally
                identifiable information. All reports are anonymous, all data is aggregated, and
                all algorithms are open-source.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Anonymous Reporting</div>
                    <div className="text-slate-600 text-sm">No accounts required for basic use</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Ethical Safeguards</div>
                    <div className="text-slate-600 text-sm">
                      Anti-profiling measures and bias mitigation
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Confidence Decay</div>
                    <div className="text-slate-600 text-sm">
                      Old reports automatically lose weight over time
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate('/privacy')}
                variant="outline"
                className="mt-8 rounded-full border-2 px-6"
                data-testid="learn-more-privacy"
              >
                Learn More About Our Privacy Commitment
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1758275557470-008d0c65f2c6?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Community"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <ShieldCheck className="h-8 w-8 text-indigo-400" />
                <span className="text-2xl font-heading font-black">Lumina</span>
              </div>
              <p className="text-slate-400 mb-4">{t('hero.subtitle')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => navigate('/map')} className="hover:text-white transition-colors">
                    {t('nav.map')}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                    {t('footer.privacy')}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t('footer.ethics')}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t('footer.openSource')}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t('footer.contact')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2025 Lumina. Safety Intelligence for Everyone.</p>
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default LandingPage;