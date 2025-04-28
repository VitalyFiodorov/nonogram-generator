import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import NonogramGenerator from './NonogramGenerator';
import MetaTags from './MetaTags';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const [seoSettings, setSeoSettings] = useState({
    title: 'Nonogram Generator - Create Custom Picture Puzzles',
    description: 'Transform your images into engaging nonogram puzzles with our free online tool. Create, customize, and download your puzzles in multiple formats.',
    keywords: 'nonogram, nonogram generator, picture puzzle, puzzle maker, nonogram creator',
    ogTitle: 'Nonogram Generator | Create Custom Picture Puzzles Online',
    ogDescription: 'Create your own custom nonogram puzzles from images. Free online tool to generate, customize, and download picture puzzles.',
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Create Custom Nonogram Puzzles Online',
    twitterDescription: 'Transform your images into fun nonogram puzzles with our free online generator. Perfect for puzzle enthusiasts!',
    favicon: '/vite.svg',
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('seoSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSeoSettings(parsed);
      } catch (err) {
        console.error('Error parsing saved settings:', err);
      }
    }
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <MetaTags {...seoSettings} />
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: { xs: 0, md: '0 0 2rem 2rem' },
          boxShadow: 3
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Nonogram Generator
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.9,
                maxWidth: 600,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Transform your images into engaging nonogram puzzles with our easy-to-use tool
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Features Section */}
          <Box>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                color: 'text.primary'
              }}
            >
              Features
            </Typography>
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={3} 
              sx={{ mb: 6 }}
            >
              <FeatureCard
                title="Image to Puzzle"
                description="Upload any image and convert it into a nonogram puzzle instantly"
              />
              <FeatureCard
                title="Customizable"
                description="Adjust grid size and threshold to get the perfect puzzle complexity"
              />
              <FeatureCard
                title="Multiple Formats"
                description="Download your puzzle in PNG, PDF, or SVG format"
              />
            </Stack>
          </Box>

          {/* Generator Section */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                color: 'text.primary'
              }}
            >
              Create Your Puzzle
            </Typography>
            <NonogramGenerator />
          </Paper>

          {/* How It Works Section */}
          <Box sx={{ pb: 8 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                color: 'text.primary'
              }}
            >
              How It Works
            </Typography>
            <Stack spacing={2}>
              <HowItWorksStep
                number={1}
                title="Upload Your Image"
                description="Start by uploading any image you'd like to convert into a nonogram puzzle"
              />
              <HowItWorksStep
                number={2}
                title="Adjust Settings"
                description="Fine-tune the grid resolution and threshold to achieve your desired puzzle complexity"
              />
              <HowItWorksStep
                number={3}
                title="Download & Solve"
                description="Download your puzzle in your preferred format and start solving!"
              />
            </Stack>
          </Box>
        </Stack>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.100', py: 4, mt: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Nonogram Generator. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

// Helper Components
const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <Paper 
    elevation={1} 
    sx={{ 
      p: 3, 
      flex: 1,
      borderRadius: 2,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)'
      }
    }}
  >
    <Typography variant="h6" gutterBottom color="primary">
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

const HowItWorksStep = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Paper
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        flexShrink: 0
      }}
    >
      <Typography variant="h6">{number}</Typography>
    </Paper>
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Box>
);

export default LandingPage; 