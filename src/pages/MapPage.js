import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Menu,
  ShieldCheck,
  MapPin,
  Navigation,
  AlertTriangle,
  Clock,
  Filter,
  Home,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { safetyAPI } from '@/utils/api';
import ReportDialog from '@/components/ReportDialog';
import RouteDialog from '@/components/RouteDialog';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const MapPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signals, setSignals] = useState([]);
  const [areaScores, setAreaScores] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // NYC default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadMapData();
  }, [timeOfDay]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const [signalsRes, areasRes] = await Promise.all([
        safetyAPI.getSignals({ time_of_day: timeOfDay }),
        safetyAPI.getAreaScores()
      ]);
      setSignals(signalsRes.data);
      setAreaScores(areasRes.data);
      
      if (signalsRes.data.length > 0) {
        const firstSignal = signalsRes.data[0];
        setMapCenter([firstSignal.location.lat, firstSignal.location.lng]);
      }
    } catch (error) {
      console.error('Failed to load map data:', error);
      toast.error('Failed to load safety data');
    } finally {
      setLoading(false);
    }
  };

  const getSafetyColor = (score) => {
    if (score >= 75) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getSafetyLabel = (score) => {
    if (score >= 75) return 'Safe';
    if (score >= 50) return 'Caution';
    return 'High Risk';
  };

  const handleMapClick = (e) => {
    setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
  };

  const MapClickHandler = () => {
    const map = useMap();
    useEffect(() => {
      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }, [map]);
    return null;
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-slate-900">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] map-control-panel shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-lg" data-testid="home-button">
              <Home size={20} />
            </button>
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-heading font-bold hidden sm:inline">Lumina Safety Map</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowRouteDialog(true)}
              variant="outline"
              size="sm"
              className="hidden sm:flex rounded-full"
              data-testid="plan-route-button"
            >
              <Navigation size={16} className="mr-1" />
              {t('map.planRoute')}
            </Button>
            <Button
              onClick={() => setShowReportDialog(true)}
              size="sm"
              className="rounded-full bg-indigo-600 hover:bg-indigo-700"
              data-testid="report-incident-button"
            >
              <AlertTriangle size={16} className="mr-1" />
              {t('map.reportIncident')}
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="sm"
              className="hidden md:flex rounded-full"
              data-testid="dashboard-button"
            >
              <User size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Left Control Panel */}
      <Card className="absolute left-4 top-20 z-[1000] w-80 max-h-[calc(100vh-6rem)] overflow-y-auto map-control-panel hidden lg:block" data-testid="control-panel">
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t('map.searchPlaceholder')}
                className="pl-10 rounded-full"
                data-testid="search-input"
              />
            </div>
          </div>

          {/* Time of Day Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-2 block uppercase tracking-wider">
              <Clock size={12} className="inline mr-1" />
              {t('map.timeOfDay')}
            </label>
            <Tabs value={timeOfDay} onValueChange={setTimeOfDay} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="morning" data-testid="time-morning">{t('map.morning')}</TabsTrigger>
                <TabsTrigger value="evening" data-testid="time-evening">{t('map.evening')}</TabsTrigger>
                <TabsTrigger value="night" data-testid="time-night">{t('map.night')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Safety Legend */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-2 block uppercase tracking-wider">
              Safety Levels
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-safety-safe" />
                <span className="text-sm">Safe (75-100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-safety-warning" />
                <span className="text-sm">Caution (50-74)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-safety-danger" />
                <span className="text-sm">High Risk (&lt;50)</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Active Signals</span>
                <span className="font-semibold">{signals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Areas Monitored</span>
                <span className="font-semibold">{areaScores.length}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler />

        {/* Area Safety Scores */}
        {areaScores.map((area) => {
          const score = area.safety_scores[timeOfDay] || area.safety_scores.overall;
          return (
            <Circle
              key={area.id}
              center={[area.location.lat, area.location.lng]}
              radius={area.radius_meters}
              pathOptions={{
                fillColor: getSafetyColor(score),
                fillOpacity: 0.3,
                color: getSafetyColor(score),
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2" data-testid="area-popup">
                  <div className="font-semibold text-sm mb-1">{area.area_name}</div>
                  <div className="text-xs space-y-1">
                    <div>Safety Score: <span className="font-bold">{score.toFixed(0)}</span></div>
                    <div>Confidence: {(area.confidence_level * 100).toFixed(0)}%</div>
                    <div>Incidents: {area.incident_count}</div>
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Safety Signals */}
        {signals.map((signal) => {
          const markerColor = signal.severity === 'high' ? '#EF4444' :
                            signal.severity === 'medium' ? '#F59E0B' : '#10B981';
          
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12]
          });

          return (
            <Marker
              key={signal.id}
              position={[signal.location.lat, signal.location.lng]}
              icon={icon}
            >
              <Popup>
                <div className="p-2" data-testid="signal-popup">
                  <div className="font-semibold text-sm mb-1 capitalize">{signal.incident_type.replace('_', ' ')}</div>
                  <div className="text-xs space-y-1">
                    <div>Severity: <span className="font-bold capitalize">{signal.severity}</span></div>
                    <div>Time: {signal.time_of_day}</div>
                    <div>Confidence: {(signal.confidence_score * 100).toFixed(0)}%</div>
                    {signal.description && <div className="mt-1 text-slate-600">{signal.description}</div>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Display */}
        {route && (
          <>
            <Polyline
              positions={route.points.map(p => [p.lat, p.lng])}
              pathOptions={{
                color: '#4F46E5',
                weight: 4,
                opacity: 0.7
              }}
            />
            {route.risky_segments.map((segment, idx) => (
              <Circle
                key={`risky-${idx}`}
                center={[segment.location.lat, segment.location.lng]}
                radius={50}
                pathOptions={{
                  fillColor: '#EF4444',
                  fillOpacity: 0.4,
                  color: '#EF4444',
                  weight: 2
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <div className="font-semibold text-red-600">High Risk Area</div>
                    <div>Safety Score: {segment.safety_score.toFixed(0)}</div>
                  </div>
                </Popup>
              </Circle>
            ))}
          </>
        )}
      </MapContainer>

      {/* Bottom Info Panel (Mobile) */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] lg:hidden map-control-panel border-t p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-xs text-slate-500">Signals</div>
              <div className="font-bold">{signals.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Areas</div>
              <div className="font-bold">{areaScores.length}</div>
            </div>
          </div>
          <Button
            onClick={() => setShowRouteDialog(true)}
            size="sm"
            variant="outline"
            className="rounded-full"
          >
            <Navigation size={14} className="mr-1" />
            Route
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <ReportDialog
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        selectedLocation={selectedLocation}
        onReportSubmit={() => loadMapData()}
      />
      <RouteDialog
        open={showRouteDialog}
        onClose={() => setShowRouteDialog(false)}
        onRouteCalculated={setRoute}
      />
    </div>
  );
};

export default MapPage;
