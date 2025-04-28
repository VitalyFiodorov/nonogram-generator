import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface NonogramGridProps {
  rows: number[][];
  cols: number[][];
  grid: boolean[][];
  showSolution: boolean;
  cellSize?: number;
}

const NonogramGrid = ({ rows, cols, grid, showSolution }: NonogramGridProps) => {
  const [cellSize, setCellSize] = useState(30);
  const maxRowHints = Math.max(...rows.map(r => r.length));
  const maxColHints = Math.max(...cols.map(c => c.length));
  
  // Calculate total grid dimensions
  const totalCols = maxRowHints + grid[0].length;

  // Update cell size based on container width
  useEffect(() => {
    const updateCellSize = () => {
      const containerWidth = document.getElementById('nonogram-container')?.clientWidth || 600;
      const newCellSize = Math.floor(containerWidth / totalCols);
      setCellSize(newCellSize);
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [totalCols]);

  return (
    <Box
      id="nonogram-container"
      sx={{
        width: '100%',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          height: 'auto',
          gridTemplateColumns: `repeat(${maxRowHints}, ${cellSize}px) repeat(${grid[0].length}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${maxColHints}, ${cellSize}px) repeat(${grid.length}, ${cellSize}px)`,
          gap: '1px',
          bgcolor: 'grey.300',
          '& > div': {
            transition: 'background-color 0.2s',
          }
        }}
      >
        {/* Empty top-left corner */}
        <Box
          sx={{
            gridColumn: `1 / span ${maxRowHints}`,
            gridRow: `1 / span ${maxColHints}`,
            bgcolor: 'white',
          }}
        />

        {/* Column hints */}
        {cols.map((hints, colIndex) => (
          <Box
            key={`col-${colIndex}`}
            sx={{
              gridColumn: maxRowHints + colIndex + 1,
              gridRow: `1 / span ${maxColHints}`,
              bgcolor: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              borderLeft: (colIndex % 5 === 0) ? '2px solid #999' : undefined,
            }}
          >
            {hints.map((hint, hintIndex) => (
              <Typography
                key={`col-${colIndex}-hint-${hintIndex}`}
                variant="body2"
                fontWeight="bold"
                sx={{ fontSize: `${Math.max(cellSize * 0.4, 8)}px` }}
              >
                {hint}
              </Typography>
            ))}
          </Box>
        ))}

        {/* Row hints */}
        {rows.map((hints, rowIndex) => (
          <Box
            key={`row-${rowIndex}`}
            sx={{
              gridRow: maxColHints + rowIndex + 1,
              gridColumn: `1 / span ${maxRowHints}`,
              bgcolor: 'white',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              pr: 1,
              borderTop: (rowIndex % 5 === 0) ? '2px solid #999' : undefined,
            }}
          >
            {hints.map((hint, hintIndex) => (
              <Typography
                key={`row-${rowIndex}-hint-${hintIndex}`}
                variant="body2"
                fontWeight="bold"
                sx={{ 
                  mx: 0.5,
                  fontSize: `${Math.max(cellSize * 0.4, 8)}px`
                }}
              >
                {hint}
              </Typography>
            ))}
          </Box>
        ))}

        {/* Grid cells */}
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Box
              key={`cell-${rowIndex}-${colIndex}`}
              sx={{
                gridColumn: maxRowHints + colIndex + 1,
                gridRow: maxColHints + rowIndex + 1,
                bgcolor: showSolution && cell ? 'black' : 'white',
                border: 1,
                borderColor: 'grey.300',
                borderLeft: (colIndex % 5 === 0) ? '2px solid #999' : undefined,
                borderTop: (rowIndex % 5 === 0) ? '2px solid #999' : undefined,
                '&:hover': {
                  bgcolor: showSolution ? (cell ? 'black' : 'white') : 'grey.100',
                },
                cursor: 'pointer',
              }}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default NonogramGrid; 