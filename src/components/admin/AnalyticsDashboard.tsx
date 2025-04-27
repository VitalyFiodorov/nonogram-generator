import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Mock data - replace with real API data in production
const mockData = {
  dailyVisits: [
    { date: '2024-04-21', visits: 120, uniqueVisitors: 89 },
    { date: '2024-04-22', visits: 145, uniqueVisitors: 102 },
    { date: '2024-04-23', visits: 168, uniqueVisitors: 123 },
    { date: '2024-04-24', visits: 189, uniqueVisitors: 134 },
    { date: '2024-04-25', visits: 210, uniqueVisitors: 156 },
    { date: '2024-04-26', visits: 178, uniqueVisitors: 130 },
    { date: '2024-04-27', visits: 198, uniqueVisitors: 145 },
  ],
  deviceStats: [
    { device: 'Desktop', count: 450 },
    { device: 'Mobile', count: 380 },
    { device: 'Tablet', count: 170 },
  ],
  topCountries: [
    { country: 'United States', visits: 320 },
    { country: 'United Kingdom', visits: 180 },
    { country: 'Germany', visits: 150 },
    { country: 'France', visits: 120 },
    { country: 'Canada', visits: 100 },
  ],
};

const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
      {subtitle && (
        <Typography color="textSecondary" sx={{ fontSize: 14 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7days');

  // Calculate total visits and unique visitors
  const totalVisits = mockData.dailyVisits.reduce((sum, day) => sum + day.visits, 0);
  const totalUniqueVisitors = mockData.dailyVisits.reduce((sum, day) => sum + day.uniqueVisitors, 0);
  const averageVisitsPerDay = Math.round(totalVisits / mockData.dailyVisits.length);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Traffic Analytics
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="90days">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Visits"
            value={totalVisits}
            subtitle="Last 7 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Unique Visitors"
            value={totalUniqueVisitors}
            subtitle="Last 7 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Average Daily Visits"
            value={averageVisitsPerDay}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Traffic Overview
            </Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <LineChart data={mockData.dailyVisits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke={theme.palette.primary.main}
                    name="Total Visits"
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueVisitors"
                    stroke={theme.palette.secondary.main}
                    name="Unique Visitors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Device Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={mockData.deviceStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={theme.palette.primary.main} name="Visits" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Countries
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={mockData.topCountries} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="country" type="category" />
                  <Tooltip />
                  <Bar dataKey="visits" fill={theme.palette.secondary.main} name="Visits" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard; 