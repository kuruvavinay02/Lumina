import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Download,
  Map,
  Users,
  Activity,
  FileText,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { safetyAPI } from '@/utils/api';
import { toast } from 'sonner';

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to access dashboard');
      navigate('/');
      return;
    }

    if (user && !['ngo', 'city', 'admin'].includes(user.role)) {
      toast.error('Access denied. NGO, City, or Admin role required.');
      navigate('/');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, trendsRes, hotspotsRes] = await Promise.all([
        safetyAPI.getDashboardMetrics(),
        safetyAPI.getRiskTrends(),
        safetyAPI.getHotspots()
      ]);
      setMetrics(metricsRes.data);
      setTrends(trendsRes.data.trends);
      setHotspots(hotspotsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await safetyAPI.exportAnalytics({ format });
      toast.success(`Export initiated. Download will be ready shortly.`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-lg" data-testid="dashboard-home-button">
                <Home size={20} />
              </button>
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-heading font-black">NGO Dashboard</h1>
                <p className="text-sm text-slate-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate('/map')}
                variant="outline"
                size="sm"
                className="rounded-full"
                data-testid="go-to-map-button"
              >
                <Map size={16} className="mr-1" />
                View Map
              </Button>
              <Button
                onClick={() => handleExport('csv')}
                size="sm"
                className="rounded-full bg-indigo-600"
                data-testid="export-csv-button"
              >
                <Download size={16} className="mr-1" />
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport('pdf')}
                size="sm"
                variant="outline"
                className="rounded-full"
                data-testid="export-pdf-button"
              >
                <FileText size={16} className="mr-1" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 metric-card" data-testid="metric-total-signals">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Total Signals</div>
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-3xl font-heading font-black">{metrics?.total_signals || 0}</div>
            <div className="text-xs text-slate-500 mt-1">All time</div>
          </Card>

          <Card className="p-6 metric-card" data-testid="metric-recent-signals">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Last 30 Days</div>
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-heading font-black">{metrics?.last_30_days || 0}</div>
            <div className="text-xs text-slate-500 mt-1">Recent activity</div>
          </Card>

          <Card className="p-6 metric-card" data-testid="metric-high-severity">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">High Severity</div>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-3xl font-heading font-black">{metrics?.high_severity_count || 0}</div>
            <div className="text-xs text-slate-500 mt-1">Requires attention</div>
          </Card>

          <Card className="p-6 metric-card" data-testid="metric-areas-monitored">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Areas Monitored</div>
              <Map className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-heading font-black">{metrics?.areas_monitored || 0}</div>
            <div className="text-xs text-slate-500 mt-1">Active zones</div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Chart */}
          <Card className="p-6" data-testid="trend-chart-card">
            <h3 className="text-lg font-heading font-bold mb-4">Risk Trends (30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} name="Total Signals" />
                <Line type="monotone" dataKey="high_severity" stroke="#EF4444" strokeWidth={2} name="High Severity" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Hotspots */}
          <Card className="p-6" data-testid="hotspots-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-bold">Emerging Hotspots</h3>
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {hotspots.slice(0, 5).map((hotspot, idx) => (
                <div
                  key={hotspot.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
                  data-testid={`hotspot-item-${idx}`}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{hotspot.area_name}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {hotspot.last_30_days_incidents} incidents · {(hotspot.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">{hotspot.risk_score.toFixed(0)}</div>
                    <div className="text-xs text-slate-500">Risk Score</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Insights Panel */}
        <Card className="p-6" data-testid="insights-panel">
          <h3 className="text-lg font-heading font-bold mb-4">Preventive Action Insights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-amber-900">High Risk Areas Detected</div>
                    <div className="text-xs text-amber-700 mt-1">
                      {hotspots.length} areas show elevated risk. Consider targeted interventions.
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-emerald-900">Community Participation</div>
                    <div className="text-xs text-emerald-700 mt-1">
                      {(metrics?.community_participation_rate * 100).toFixed(0)}% active participation rate this month.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-blue-900">Trend Velocity</div>
                    <div className="text-xs text-blue-700 mt-1">
                      Incident reporting {metrics?.last_30_days > 50 ? 'increasing' : 'stable'}. Monitor closely.
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-indigo-900">Average Confidence</div>
                    <div className="text-xs text-indigo-700 mt-1">
                      {(metrics?.avg_confidence * 100).toFixed(0)}% confidence across all signals.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;