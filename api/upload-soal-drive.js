/**
 * Vercel Serverless Function — Upload Soal ke Google Drive
 * 
 * Endpoint: POST /api/upload-soal-drive
 * 
 * Menerima file soal (PDF/DOCX) dari dashboard sensei dan menguploadnya
 * ke folder Google Drive yang ditentukan menggunakan Google Service Account.
 * 
 * Environment Variables Required:
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_PRIVATE_KEY
 * - GOOGLE_DRIVE_FOLDER_ID
 */

import { google } from 'googleapis';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Parse multipart form data from the request manually.
 * Returns an object with fields and file buffer.
 */
async function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      const boundaryMatch = contentType.match(/boundary=(.+)/);
      
      if (!boundaryMatch) {
        reject(new Error('No boundary found in content-type'));
        return;
      }

      const boundary = boundaryMatch[1];
      const parts = buffer.toString('binary').split(`--${boundary}`);
      
      const result = { fields: {}, file: null, fileName: '', fileMimeType: '' };

      for (const part of parts) {
        if (part === '' || part === '--\r\n' || part === '--') continue;

        const headerEndIndex = part.indexOf('\r\n\r\n');
        if (headerEndIndex === -1) continue;

        const headers = part.substring(0, headerEndIndex);
        const body = part.substring(headerEndIndex + 4).replace(/\r\n$/, '');

        const nameMatch = headers.match(/name="([^"]+)"/);
        const filenameMatch = headers.match(/filename="([^"]+)"/);
        const contentTypeMatch = headers.match(/Content-Type:\s*(.+)/i);

        if (nameMatch) {
          if (filenameMatch) {
            // This is a file field
            result.file = Buffer.from(body, 'binary');
            result.fileName = filenameMatch[1];
            result.fileMimeType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
          } else {
            // This is a text field
            result.fields[nameMatch[1]] = body.trim();
          }
        }
      }

      resolve(result);
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!serviceEmail || !privateKey || !folderId) {
      return res.status(500).json({ 
        error: 'Server configuration error: Google Drive credentials not configured' 
      });
    }

    // Parse multipart form data
    const formData = await parseMultipartForm(req);

    if (!formData.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const judul = formData.fields.judul || 'Untitled';
    const kelasTarget = formData.fields.kelasTarget || 'Semua Kelas';
    const namaSensei = formData.fields.namaSensei || 'Unknown';

    // Authenticate with Google Drive API using Service Account
    const auth = new google.auth.JWT(
      serviceEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/drive.file']
    );

    const drive = google.drive({ version: 'v3', auth });

    // Generate descriptive filename
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanJudul = judul.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
    const uploadFileName = `${cleanJudul}_${dateStr}_${formData.fileName}`;

    // Upload file to Google Drive
    const fileStream = new Readable();
    fileStream.push(formData.file);
    fileStream.push(null);

    const driveResponse = await drive.files.create({
      requestBody: {
        name: uploadFileName,
        parents: [folderId],
        description: `Soal dari ${namaSensei} | Kelas: ${kelasTarget} | Tanggal: ${dateStr}`,
      },
      media: {
        mimeType: formData.fileMimeType,
        body: fileStream,
      },
      fields: 'id, name, webViewLink',
    });

    return res.status(200).json({
      success: true,
      fileId: driveResponse.data.id,
      fileName: driveResponse.data.name,
      url: driveResponse.data.webViewLink || `https://drive.google.com/file/d/${driveResponse.data.id}/view`,
      message: 'File berhasil diupload ke Google Drive',
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Gagal mengupload file',
      details: error.message 
    });
  }
}
