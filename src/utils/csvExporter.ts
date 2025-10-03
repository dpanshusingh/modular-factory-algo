import { Timelog } from '../types/@server';

export const exportTimelogsToCSV = (timelogs: Timelog[]): string => {
  if (timelogs.length === 0) {
    return 'No data to export';
  }

  // CSV headers
  const headers = [
    'ID',
    'Employee ID',
    'Employee Name',
    'Start Time',
    'End Time',
    'Duration (hours)',
    'Description',
    'Created At'
  ];

  // Convert timelogs to CSV rows
  const rows = timelogs.map(timelog => {
    const startTime = new Date(timelog.startTime);
    const endTime = new Date(timelog.endTime);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
    
    return [
      timelog.id,
      timelog.employeeId,
      timelog.employee ? timelog.employee.name : '',
      startTime.toISOString(),
      endTime.toISOString(),
      durationHours,
      timelog.description || '',
      timelog.createdAt.toISOString()
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

export const formatCSVResponse = (csvContent: string, filename: string = 'timelogs') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.csv`;
  
  return {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${fullFilename}"`,
    },
    content: csvContent,
    filename: fullFilename
  };
};
