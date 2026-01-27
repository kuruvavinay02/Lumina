import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation, AlertTriangle } from 'lucide-react';
import { safetyAPI } from '@/utils/api';
import { toast } from 'sonner';

const RouteDialog = ({ open, onClose, onRouteCalculated }) => {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState({
    start_lat: '',
    start_lng: '',
    end_lat: '',
    end_lng: '',
    time_of_day: 'morning',
    prefer_safety: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await safetyAPI.planRoute({
        start: {
          lat: parseFloat(routeData.start_lat),
          lng: parseFloat(routeData.start_lng)
        },
        end: {
          lat: parseFloat(routeData.end_lat),
          lng: parseFloat(routeData.end_lng)
        },
        time_of_day: routeData.time_of_day,
        prefer_safety: routeData.prefer_safety
      });
      
      onRouteCalculated?.(response.data);
      toast.success(`Route calculated! Safety Score: ${response.data.overall_safety_score.toFixed(0)}`);
      
      if (response.data.risky_segments.length > 0) {
        toast.warning(`⚠️ ${response.data.risky_segments.length} high-risk area(s) detected on route`);
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to calculate route');
    } finally {
      setLoading(false);
    }
  };

  const useDemoRoute = () => {
    setRouteData({
      start_lat: '40.7128',
      start_lng: '-74.0060',
      end_lat: '40.7580',
      end_lng: '-73.9855',
      time_of_day: 'morning',
      prefer_safety: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="route-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold flex items-center space-x-2">
            <Navigation size={20} />
            <span>Plan Safe Route</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Location */}
          <div className="space-y-2">
            <Label>Start Location</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Latitude"
                type="number"
                step="any"
                value={routeData.start_lat}
                onChange={(e) => setRouteData({ ...routeData, start_lat: e.target.value })}
                required
                data-testid="start-lat-input"
              />
              <Input
                placeholder="Longitude"
                type="number"
                step="any"
                value={routeData.start_lng}
                onChange={(e) => setRouteData({ ...routeData, start_lng: e.target.value })}
                required
                data-testid="start-lng-input"
              />
            </div>
          </div>

          {/* End Location */}
          <div className="space-y-2">
            <Label>Destination</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Latitude"
                type="number"
                step="any"
                value={routeData.end_lat}
                onChange={(e) => setRouteData({ ...routeData, end_lat: e.target.value })}
                required
                data-testid="end-lat-input"
              />
              <Input
                placeholder="Longitude"
                type="number"
                step="any"
                value={routeData.end_lng}
                onChange={(e) => setRouteData({ ...routeData, end_lng: e.target.value })}
                required
                data-testid="end-lng-input"
              />
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <Label htmlFor="route-time">Time of Travel</Label>
            <Select
              value={routeData.time_of_day}
              onValueChange={(value) => setRouteData({ ...routeData, time_of_day: value })}
            >
              <SelectTrigger data-testid="route-time-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Demo Button */}
          <Button
            type="button"
            variant="outline"
            onClick={useDemoRoute}
            className="w-full"
            data-testid="demo-route-button"
          >
            Use Demo Route (NYC)
          </Button>

          {/* Info */}
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-slate-700 flex items-start space-x-2">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <span>The safest route may not be the shortest. High-risk areas will be highlighted.</span>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-indigo-600"
            disabled={loading}
            data-testid="calculate-route-button"
          >
            {loading ? 'Calculating...' : 'Calculate Safe Route'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDialog;