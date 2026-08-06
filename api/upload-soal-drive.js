import { google } from 'googleapis';
import Busboy from 'busboy';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    let fileBuffer = null;
    let fileName = '';
    let fileMimeType = '';

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, info) => {
      const { filename, mimeType } = info;
      fileName = filename;
      fileMimeType = mimeType;
      const chunks = [];

      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    busboy.on('finish', () => {
      resolve({ fields, file: fileBuffer, fileName, fileMimeType });
    });

    busboy.on('error', (err) => reject(err));

    req.pipe(busboy);
  });
}

export default async function handler(req, res) {
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
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!serviceEmail || !privateKey || !folderId) {
      return res.status(500).json({ 
        error: 'Google Drive environment variables not set' 
      });
    }

    const formData = await parseMultipartForm(req);

    if (!formData.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const auth = new google.auth.JWT(
      serviceEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/drive.file']
    );

    const drive = google.drive({ version: 'v3', auth });

    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanJudul = (formData.fields.judul || 'Untitled').replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
    const uploadFileName = `${cleanJudul}_${dateStr}_${formData.fileName}`;

    const fileStream = new Readable();
    fileStream.push(formData.file);
    fileStream.push(null);

    const driveResponse = await drive.files.create({
      requestBody: {
        name: uploadFileName,
        parents: [folderId],
        description: `Soal dari ${formData.fields.namaSensei || 'Sensei'} | Kelas: ${formData.fields.kelasTarget || 'Semua'} | Tanggal: ${dateStr}`,
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
      error: 'Gagal mengupload file ke Google Drive',
      details: error.message 
    });
  }
}
