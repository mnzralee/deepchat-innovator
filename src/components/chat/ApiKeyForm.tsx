
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Key } from 'lucide-react';

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const storedKey = localStorage.getItem('deepseek-api-key');
    setHasKey(!!storedKey);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);
  
  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('deepseek-api-key', apiKey.trim());
      setHasKey(true);
      setOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your DeepSeek API key has been saved securely in your browser."
      });
    }
  };
  
  const handleRemoveKey = () => {
    localStorage.removeItem('deepseek-api-key');
    setApiKey('');
    setHasKey(false);
    toast({
      title: "API Key Removed",
      description: "Your DeepSeek API key has been removed."
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasKey ? "outline" : "default"} 
          size="sm"
          className={hasKey ? "text-green-600 bg-green-50 border-green-200 hover:bg-green-100" : ""}
        >
          <Key className="h-4 w-4 mr-2" />
          {hasKey ? "API Key Saved" : "Add API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>DeepSeek API Key</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Enter your DeepSeek API key to enable the chat functionality. Your key is stored locally in your browser and is never sent to our servers.
          </p>
          
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your DeepSeek API key"
            type="password"
          />
          
          <div className="text-xs text-muted-foreground">
            <p>You can get your API key from the DeepSeek dashboard.</p>
            <p className="mt-1">Visit: <a href="https://deepseek.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://deepseek.com/dashboard</a></p>
          </div>
          
          <div className="flex justify-between">
            {hasKey && (
              <Button 
                variant="outline" 
                onClick={handleRemoveKey}
              >
                Remove Key
              </Button>
            )}
            <Button 
              onClick={handleSaveKey}
              disabled={!apiKey.trim()}
              className="ml-auto"
            >
              Save Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyForm;
