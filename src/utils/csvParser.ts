
export interface CSVData {
  headers: string[];
  rows: { [key: string]: string }[];
}

export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote inside quoted field
        current += '"';
        i += 2; // Skip both quotes
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator outside of quotes
      result.push(current.trim());
      current = '';
      i++;
    } else {
      // Regular character
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(current.trim());
  return result;
};

export const parseCSV = (csvText: string): CSVData => {
  console.log('Parsing CSV with proper parser...');
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const headers = parseCSVLine(lines[0]).map(header => header.replace(/^"|"$/g, '').trim());
  console.log('Parsed headers:', headers);

  const rows = lines.slice(1).map((line, index) => {
    try {
      const values = parseCSVLine(line);
      const row: { [key: string]: string } = {};
      
      headers.forEach((header, headerIndex) => {
        let value = values[headerIndex] || '';
        // Remove surrounding quotes if present
        value = value.replace(/^"|"$/g, '').trim();
        row[header] = value;
      });
      
      return row;
    } catch (error) {
      console.error(`Error parsing line ${index + 2}:`, error);
      throw new Error(`Error parsing line ${index + 2}: ${error.message}`);
    }
  });

  console.log('Successfully parsed CSV:', headers.length, 'columns,', rows.length, 'rows');
  console.log('Sample row:', rows[0]);
  return { headers, rows };
};
