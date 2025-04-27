export interface NonogramData {
  rows: number[][];
  cols: number[][];
  grid: boolean[][];
}

export const generateNonogram = (grid: boolean[][]): NonogramData => {
  const height = grid.length;
  const width = grid[0].length;

  // Generate row hints
  const rows = grid.map(row => {
    const hints: number[] = [];
    let count = 0;
    
    for (let x = 0; x <= width; x++) {
      if (x < width && row[x]) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    
    return hints.length ? hints : [0];
  });

  // Generate column hints
  const cols = Array(width).fill(0).map((_, x) => {
    const hints: number[] = [];
    let count = 0;
    
    for (let y = 0; y <= height; y++) {
      if (y < height && grid[y][x]) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    
    return hints.length ? hints : [0];
  });

  return { rows, cols, grid };
}; 