import { useState, useRef, useCallback, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Slider,
} from '@mui/material';
import { generateNonogram, NonogramData } from '../utils/nonogramUtils';
import NonogramGrid from './NonogramGrid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const NonogramGenerator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState(20);
  const [threshold, setThreshold] = useState(200);
  const [showSolution, setShowSolution] = useState(true);
  const [nonogramData, setNonogramData] = useState<NonogramData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nonogramRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(e.target?.result as string);
          processImage(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = useCallback((img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use gridSize as the target dimension for the longer side
    const aspectRatio = img.width / img.height;
    let targetWidth: number, targetHeight: number;
    
    if (aspectRatio > 1) {
      targetWidth = gridSize;
      targetHeight = Math.max(1, Math.round(gridSize / aspectRatio));
    } else {
      targetHeight = gridSize;
      targetWidth = Math.max(1, Math.round(gridSize * aspectRatio));
    }

    // First draw image at original size
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Create a temporary canvas for downscaling
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Use better image smoothing
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    
    // Draw scaled version
    tempCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
    
    // Get scaled image data
    const imageData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
    const grid = Array(targetHeight).fill(0).map(() => Array(targetWidth).fill(false));
    
    // Convert to black and white grid with user-defined threshold
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const i = (y * targetWidth + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        
        if (a < 128) {
          grid[y][x] = false;
        } else {
          const brightness = (r + g + b) / 3;
          grid[y][x] = brightness < threshold;
        }
      }
    }

    const nonogramData = generateNonogram(grid);
    setNonogramData(nonogramData);
  }, [threshold, gridSize]);

  const downloadAsImage = async () => {
    if (!nonogramRef.current) return;
    try {
      // Hide download buttons before capturing
      const buttonsContainer = document.getElementById('download-buttons');
      if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
      }

      const canvas = await html2canvas(nonogramRef.current);
      
      // Restore buttons
      if (buttonsContainer) {
        buttonsContainer.style.display = 'flex';
      }

      const link = document.createElement('a');
      link.download = 'nonogram.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      setError('Error downloading image');
    }
  };

  const downloadAsPDF = async () => {
    if (!nonogramRef.current) return;
    try {
      // Hide download buttons before capturing
      const buttonsContainer = document.getElementById('download-buttons');
      if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
      }

      const canvas = await html2canvas(nonogramRef.current);
      
      // Restore buttons
      if (buttonsContainer) {
        buttonsContainer.style.display = 'flex';
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('nonogram.pdf');
    } catch (error) {
      setError('Error downloading PDF');
    }
  };

  const downloadAsSVG = () => {
    if (!nonogramRef.current) return;
    try {
      // Create SVG content
      const svgContent = generateSVG(nonogramData!, showSolution);
      
      // Create download link
      const link = document.createElement('a');
      link.download = 'nonogram.svg';
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      setError('Error downloading SVG');
    }
  };

  // Function to generate SVG content
  const generateSVG = (data: NonogramData, showSolution: boolean) => {
    const cellSize = 30;
    const maxRowHints = Math.max(...data.rows.map(r => r.length));
    const maxColHints = Math.max(...data.cols.map(c => c.length));
    const width = (maxRowHints + data.grid[0].length) * cellSize;
    const height = (maxColHints + data.grid.length) * cellSize;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .cell { stroke: #ccc; }
        .cell-border { stroke-width: 1; }
        .thick-border { stroke-width: 2; }
        .hint { font-family: Arial; font-size: 12px; font-weight: bold; }
      </style>
      <rect width="100%" height="100%" fill="white"/>`;

    // Draw grid cells
    data.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = (maxRowHints + colIndex) * cellSize;
        const y = (maxColHints + rowIndex) * cellSize;
        
        // Determine which borders should be thick
        const isThickLeft = colIndex % 5 === 0;
        const isThickTop = rowIndex % 5 === 0;
        const isThickRight = (colIndex + 1) % 5 === 0;
        const isThickBottom = (rowIndex + 1) % 5 === 0;

        // Draw the cell background
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" 
          class="cell"
          fill="${showSolution && cell ? 'black' : 'white'}"
        />`;

        // Draw individual borders with appropriate thickness
        // Left border
        svg += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + cellSize}" 
          class="cell ${isThickLeft ? 'thick-border' : 'cell-border'}"
        />`;
        
        // Top border
        svg += `<line x1="${x}" y1="${y}" x2="${x + cellSize}" y2="${y}" 
          class="cell ${isThickTop ? 'thick-border' : 'cell-border'}"
        />`;
        
        // Right border (only if last in row or thick border needed)
        if (colIndex === row.length - 1 || isThickRight) {
          svg += `<line x1="${x + cellSize}" y1="${y}" x2="${x + cellSize}" y2="${y + cellSize}" 
            class="cell ${isThickRight ? 'thick-border' : 'cell-border'}"
          />`;
        }
        
        // Bottom border (only if last in column or thick border needed)
        if (rowIndex === data.grid.length - 1 || isThickBottom) {
          svg += `<line x1="${x}" y1="${y + cellSize}" x2="${x + cellSize}" y2="${y + cellSize}" 
            class="cell ${isThickBottom ? 'thick-border' : 'cell-border'}"
          />`;
        }
      });
    });

    // Draw row hints
    data.rows.forEach((hints, rowIndex) => {
      hints.forEach((hint, hintIndex) => {
        const x = (maxRowHints - hints.length + hintIndex) * cellSize + cellSize/2;
        const y = (maxColHints + rowIndex) * cellSize + cellSize/2 + 4;
        svg += `<text x="${x}" y="${y}" class="hint" text-anchor="middle">${hint}</text>`;
      });
    });

    // Draw column hints
    data.cols.forEach((hints, colIndex) => {
      hints.forEach((hint, hintIndex) => {
        const x = (maxRowHints + colIndex) * cellSize + cellSize/2;
        const y = (maxColHints - hints.length + hintIndex) * cellSize + cellSize/2 + 4;
        svg += `<text x="${x}" y="${y}" class="hint" text-anchor="middle">${hint}</text>`;
      });
    });

    svg += '</svg>';
    return svg;
  };

  return (
    <Stack spacing={3} width="100%">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Image
      </Button>

      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={4} 
        alignItems="flex-start"
        sx={{ width: '100%' }}
      >
        {/* Grid Resolution Control */}
        <Box sx={{ minWidth: { xs: '100%', md: '250px' } }}>
          <Typography gutterBottom>Grid Resolution</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: '200px' }}>
              <Slider
                value={gridSize}
                onChange={(_, value) => {
                  setGridSize(value as number);
                  if (image) {
                    const img = new Image();
                    img.onload = () => processImage(img);
                    img.src = image;
                  }
                }}
                min={5}
                max={40}
                marks={[
                  { value: 5, label: '5x5' },
                  { value: 20, label: '20x20' },
                  { value: 40, label: '40x40' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}x${value}`}
                aria-label="Grid Resolution"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {`${gridSize}x${gridSize}`}
            </Typography>
          </Stack>
        </Box>

        {/* Threshold Control */}
        <Box sx={{ minWidth: { xs: '100%', md: '250px' } }}>
          <Typography gutterBottom>Threshold</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: '200px' }}>
              <Slider
                value={threshold}
                onChange={(_, value) => {
                  setThreshold(value as number);
                  if (image) {
                    const img = new Image();
                    img.onload = () => processImage(img);
                    img.src = image;
                  }
                }}
                min={0}
                max={255}
                valueLabelDisplay="auto"
                aria-label="Threshold"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {threshold}
            </Typography>
          </Stack>
        </Box>

        {/* Original Image Preview */}
        {image && (
          <Box sx={{ 
            minWidth: { xs: '100%', md: '250px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <Typography variant="subtitle1" gutterBottom>
              Original Image:
            </Typography>
            <Box
              component="img"
              src={image}
              sx={{
                maxHeight: '100px',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        )}

        {/* Show Solution Switch */}
        <Box sx={{ 
          minWidth: { xs: '100%', md: 'auto' },
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <FormControlLabel
            control={
              <Switch
                checked={showSolution}
                onChange={(e) => setShowSolution(e.target.checked)}
              />
            }
            label="Show Solution"
          />
        </Box>
      </Stack>

      {nonogramData && (
        <Stack spacing={2}>
          <Box ref={nonogramRef} bgcolor="white" p={2}>
            <NonogramGrid
              rows={nonogramData.rows}
              cols={nonogramData.cols}
              grid={nonogramData.grid}
              showSolution={showSolution}
            />
          </Box>
          
          <Stack id="download-buttons" direction="row" spacing={2}>
            <Button variant="outlined" onClick={downloadAsImage}>
              Download as Image
            </Button>
            <Button variant="outlined" onClick={downloadAsPDF}>
              Download as PDF
            </Button>
            <Button variant="outlined" onClick={downloadAsSVG}>
              Download as SVG
            </Button>
          </Stack>
        </Stack>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default NonogramGenerator; 