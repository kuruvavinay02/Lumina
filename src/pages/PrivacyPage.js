import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Database, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { safetyAPI } from '@/utils/api';

const PrivacyPage = () => {
  const navigate = useNavigate();
  const [transparencyInfo, setTransparencyInfo] = useState(null);

  useEffect(() => {
    loadTransparencyInfo();
  }, []);

  const loadTransparencyInfo = async () => {
    try {
      const response = await safetyAPI.getTransparencyInfo();
      setTransparencyInfo(response.data);
    } catch (error) {
      console.error('Failed to load transparency info:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-lg" data-testid="privacy-home-button">
                <Home size={20} />
              </button>
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-heading font-black">Privacy & Transparency</h1>
            </div>
            <Button
              onClick={() => navigate('/map')}
              variant="outline"
              className="rounded-full"
              data-testid="privacy-map-button"
            >
              View Safety Map
            </Button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-indigo-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-4xl font-heading font-black text-slate-900 mb-4">
            Privacy by Design
          </h2>
          <p className="text-lg text-slate-700">
            Zero personally identifiable information. Complete transparency. Ethical AI from the ground up.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Data Collection */}
        <section data-testid="data-collection-section">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="h-6 w-6 text-indigo-600" />
            <h3 className="text-2xl font-heading font-bold">Data Collection</h3>
          </div>
          <Card className="p-6">
            {transparencyInfo?.data_collection && (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="font-semibold">Zero PII Collection</div>
                    <div className="text-sm text-slate-600">
                      We collect NO personally identifiable information. No names, no emails for basic reporting, no tracking.
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="font-semibold">Location Precision</div>
                    <div className="text-sm text-slate-600">
                      {transparencyInfo.data_collection.location_precision}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <div className="font-semibold">Data Retention</div>
                    <div className="text-sm text-slate-600">
                      {transparencyInfo.data_collection.data_retention}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Risk Scoring */}
        <section data-testid="risk-scoring-section">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h3 className="text-2xl font-heading font-bold">Risk Scoring Algorithm</h3>
          </div>
          <Card className="p-6">
            {transparencyInfo?.risk_scoring && (
              <div className="space-y-4">
                <div>
                  <div className="font-semibold mb-2">Algorithm Type</div>
                  <div className="text-sm text-slate-600">{transparencyInfo.risk_scoring.algorithm}</div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Factors Considered</div>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {transparencyInfo.risk_scoring.factors.map((factor, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Transparency Commitment</div>
                  <div className="text-sm text-slate-600">{transparencyInfo.risk_scoring.transparency}</div>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Ethical Safeguards */}
        <section data-testid="ethical-safeguards-section">
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <h3 className="text-2xl font-heading font-bold">Ethical Safeguards</h3>
          </div>
          <Card className="p-6">
            {transparencyInfo?.ethical_safeguards && (
              <div className="space-y-4">
                {Object.entries(transparencyInfo.ethical_safeguards).map(([key, value]) => (
                  <div key={key} className="border-b border-slate-100 pb-4 last:border-0">
                    <div className="font-semibold capitalize mb-1">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-sm text-slate-600">{value}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* Contact */}
        <div className="bg-slate-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-heading font-bold mb-2">Questions About Privacy?</h3>
          <p className="text-slate-600 mb-4">
            We're committed to transparency. Reach out anytime.
          </p>
          <Button className="rounded-full bg-indigo-600" data-testid="contact-button">
            Contact Privacy Team
          </Button>
        </div>
      </div>
    </div>
  );
};

import { TrendingUp } from 'lucide-react';
export default PrivacyPage;