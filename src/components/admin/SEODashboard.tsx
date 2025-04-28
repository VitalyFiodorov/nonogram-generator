import { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadIcon from '@mui/icons-material/Upload';
import MetaTags from '../MetaTags';

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  favicon: string;
}

interface SEODashboardProps {
  onLogout: () => void;
}

const defaultSEOSettings: SEOSettings = {
  title: 'Nonogram Generator - Create Custom Picture Puzzles',
  description: 'Transform your images into engaging nonogram puzzles with our free online tool. Create, customize, and download your puzzles in multiple formats.',
  keywords: 'nonogram, nonogram generator, picture puzzle, puzzle maker, nonogram creator',
  ogTitle: 'Nonogram Generator | Create Custom Picture Puzzles Online',
  ogDescription: 'Create your own custom nonogram puzzles from images. Free online tool to generate, customize, and download picture puzzles.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Create Custom Nonogram Puzzles Online',
  twitterDescription: 'Transform your images into fun nonogram puzzles with our free online generator. Perfect for puzzle enthusiasts!',
  favicon: '/favicon.ico',
};

const SEODashboard = ({ onLogout }: SEODashboardProps) => {
  const [settings, setSettings] = useState<SEOSettings>(defaultSEOSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    onLogout();
  };

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('seoSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleFaviconUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setSettings({ ...settings, favicon: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem('seoSettings', JSON.stringify(settings));
      setIsSaved(true);
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const handleReset = () => {
    setSettings(defaultSEOSettings);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <MetaTags {...settings} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">SEO Settings</Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" noValidate autoComplete="off">
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Basic SEO
            </Typography>
            
            {/* Favicon Section */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Favicon
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <img 
                    src={settings.favicon} 
                    alt="Current Favicon" 
                    style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
                  />
                  <input
                    type="file"
                    accept=".ico,.png,.jpg,.jpeg"
                    ref={faviconInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFaviconUpload}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={() => faviconInputRef.current?.click()}
                  >
                    Upload New Favicon
                  </Button>
                </Box>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Page Title"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Meta Description"
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Keywords"
              value={settings.keywords}
              onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
              margin="normal"
              helperText="Separate keywords with commas"
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Open Graph
            </Typography>
            <TextField
              fullWidth
              label="OG Title"
              value={settings.ogTitle}
              onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="OG Description"
              value={settings.ogDescription}
              onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="OG Image URL"
              value={settings.ogImage}
              onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
              margin="normal"
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Twitter Card
            </Typography>
            <TextField
              fullWidth
              label="Twitter Card Type"
              value={settings.twitterCard}
              onChange={(e) => setSettings({ ...settings, twitterCard: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Twitter Title"
              value={settings.twitterTitle}
              onChange={(e) => setSettings({ ...settings, twitterTitle: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Twitter Description"
              value={settings.twitterDescription}
              onChange={(e) => setSettings({ ...settings, twitterDescription: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
              >
                Reset to Default
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={isSaved}
        autoHideDuration={3000}
        onClose={() => setIsSaved(false)}
      >
        <Alert severity="success" onClose={() => setIsSaved(false)}>
          Settings saved successfully
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SEODashboard; 