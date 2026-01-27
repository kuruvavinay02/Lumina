import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { safetyAPI } from '@/utils/api';
import { toast } from 'sonner';

const ReportDialog = ({ open, onClose, selectedLocation, onReportSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    incident_type: 'harassment',
    severity: 'medium',
    time_of_day: 'morning',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast.error('Please select a location on the map first');
      return;
    }

    setLoading(true);
    try {
      await safetyAPI.createSignal({
        location: selectedLocation,
        ...reportData
      });
      toast.success('Safety signal reported successfully. Thank you for keeping the community safe!');
      onReportSubmit?.();
      onClose();
      setReportData({
        incident_type: 'harassment',
        severity: 'medium',
        time_of_day: 'morning',
        description: ''
      });
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="report-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold">Report Safety Signal</DialogTitle>
          <p className="text-sm text-slate-600">Your anonymous report helps keep the community safe</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Display */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin size={16} className="text-slate-500" />
              <span className="text-slate-600">
                {selectedLocation
                  ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
                  : 'Click on map to select location'}
              </span>
            </div>
          </div>

          {/* Incident Type */}
          <div>
            <Label htmlFor="incident-type">Incident Type</Label>
            <Select
              value={reportData.incident_type}
              onValueChange={(value) => setReportData({ ...reportData, incident_type: value })}
            >
              <SelectTrigger data-testid="incident-type-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="vandalism">Vandalism</SelectItem>
                <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                <SelectItem value="poor_lighting">Poor Lighting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div>
            <Label htmlFor="severity">Severity Level</Label>
            <Select
              value={reportData.severity}
              onValueChange={(value) => setReportData({ ...reportData, severity: value })}
            >
              <SelectTrigger data-testid="severity-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time of Day */}
          <div>
            <Label htmlFor="time-of-day">Time of Day</Label>
            <Select
              value={reportData.time_of_day}
              onValueChange={(value) => setReportData({ ...reportData, time_of_day: value })}
            >
              <SelectTrigger data-testid="time-of-day-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                <SelectItem value="evening">Evening (12PM-6PM)</SelectItem>
                <SelectItem value="night">Night (6PM-6AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details..."
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              rows={3}
              data-testid="description-textarea"
            />
          </div>

          {/* Privacy Notice */}
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-xs text-slate-700">
            🔒 <strong>Privacy:</strong> This report is completely anonymous. No personally identifiable
            information is collected.
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-indigo-600"
            disabled={loading || !selectedLocation}
            data-testid="submit-report-button"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;