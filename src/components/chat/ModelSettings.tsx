
import { useState } from 'react';
import { ModelSettings as ModelSettingsType } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ModelSettingsProps {
  settings: ModelSettingsType;
  updateSettings: (settings: Partial<ModelSettingsType>) => void;
}

const ModelSettings = ({ settings, updateSettings }: ModelSettingsProps) => {
  const [localSettings, setLocalSettings] = useState(settings);
  
  const handleChange = (key: keyof ModelSettingsType, value: string | number) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleApply = () => {
    updateSettings(localSettings);
  };
  
  const handleReset = () => {
    setLocalSettings(settings);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Model Settings</h3>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={localSettings.model}
            onChange={(e) => handleChange('model', e.target.value)}
            disabled
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <Label htmlFor="temperature">Temperature: {localSettings.temperature}</Label>
            <span className="text-xs text-muted-foreground">0 - 2</span>
          </div>
          <div className="flex gap-2">
            <input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={localSettings.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Lower values produce more consistent outputs, higher values more creative ones.
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <Label htmlFor="max_tokens">Max Tokens: {localSettings.max_tokens}</Label>
            <span className="text-xs text-muted-foreground">1 - 4096</span>
          </div>
          <Input
            id="max_tokens"
            type="number"
            min="1"
            max="4096"
            value={localSettings.max_tokens}
            onChange={(e) => handleChange('max_tokens', parseInt(e.target.value))}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <Label htmlFor="top_p">Top P: {localSettings.top_p}</Label>
            <span className="text-xs text-muted-foreground">0 - 1</span>
          </div>
          <div className="flex gap-2">
            <input
              id="top_p"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={localSettings.top_p}
              onChange={(e) => handleChange('top_p', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <Label htmlFor="frequency_penalty">Frequency Penalty: {localSettings.frequency_penalty}</Label>
            <span className="text-xs text-muted-foreground">0 - 2</span>
          </div>
          <div className="flex gap-2">
            <input
              id="frequency_penalty"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={localSettings.frequency_penalty}
              onChange={(e) => handleChange('frequency_penalty', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <Label htmlFor="presence_penalty">Presence Penalty: {localSettings.presence_penalty}</Label>
            <span className="text-xs text-muted-foreground">0 - 2</span>
          </div>
          <div className="flex gap-2">
            <input
              id="presence_penalty"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={localSettings.presence_penalty}
              onChange={(e) => handleChange('presence_penalty', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset
        </Button>
        <Button size="sm" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ModelSettings;
