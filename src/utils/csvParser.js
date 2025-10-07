const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    throw new Error('Error parsing Excel file: ' + error.message);
  }
};

// Extract emails from parsed data
const extractEmails = (data) => {
  const emails = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  data.forEach(row => {
    // Try different possible column names
    const email = row.email || row.Email || row.EMAIL || 
                 row['E-mail'] || row['e-mail'] || row.Mail;
    
    if (email && emailRegex.test(email.trim())) {
      emails.push(email.trim().toLowerCase());
    }
  });
  
  // Remove duplicates
  return [...new Set(emails)];
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Process bulk upload file
const processBulkUpload = async (filePath, fileType) => {
  try {
    let data;
    
    if (fileType === 'csv') {
      data = await parseCSV(filePath);
    } else if (fileType === 'excel' || fileType === 'xlsx') {
      data = parseExcel(filePath);
    } else {
      throw new Error('Unsupported file type');
    }
    
    const emails = extractEmails(data);
    
    return {
      success: true,
      totalRows: data.length,
      validEmails: emails,
      emailCount: emails.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Create CSV from data
const createCSV = (data, headers) => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma
      return value.toString().includes(',') 
        ? `"${value.toString().replace(/"/g, '""')}"` 
        : value;
    }).join(',');
  });
  
  return csvHeaders + '\n' + csvRows.join('\n');
};

module.exports = {
  parseCSV,
  parseExcel,
  extractEmails,
  validateEmail,
  processBulkUpload,
  createCSV
};