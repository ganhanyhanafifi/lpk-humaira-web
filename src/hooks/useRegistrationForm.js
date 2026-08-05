import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateRegistrationForm, validateFile } from '../utils/validators.js';
import { uploadFile, generateFilePath } from '../firebase/storage.js';
import { submitRegistration } from '../firebase/firestore.js';

/**
 * Sends a registration notification directly to Telegram Bot API.
 * Compatible with Firebase Spark Plan (free).
 *
 * @param {Object} data - The registration data including document URLs.
 */
const sendTelegramNotification = async (data) => {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId || botToken === 'your_bot_token_here') {
    console.warn('Telegram not configured — skipping notification.');
    return;
  }

  const waktu = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const message = `📋 <b>PENDAFTARAN BARU — LPK Humaira Institute</b>

👤 <b>Nama:</b> ${data.nama}
📱 <b>No HP:</b> ${data.no_hp}
📧 <b>Email:</b> ${data.email}
⚧ <b>Gender:</b> ${data.gender}
📏 <b>Tinggi Badan:</b> ${data.tinggi_badan} cm
🎂 <b>Usia:</b> ${data.usia} tahun
🏠 <b>Alamat:</b> ${data.alamat}

📎 <b>Dokumen:</b>
• <a href="${data.url_ktp}">KTP</a>
• <a href="${data.url_akta}">Akta Kelahiran</a>
• <a href="${data.url_kk}">Kartu Keluarga</a>
• <a href="${data.url_ijazah}">Ijazah</a>
• <a href="${data.url_izin_ortu}">Surat Izin Orang Tua</a>

🕐 <b>Waktu daftar:</b> ${waktu}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram notification failed:', errorData);
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
};

/**
 * Custom hook for managing registration form state and submission.
 */
export const useRegistrationForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    email: '',
    gender: '',
    tinggi_badan: '',
    usia: '',
    alamat: ''
  });
  
  const [files, setFiles] = useState({
    ktp: null,
    akta: null,
    kk: null,
    ijazah: null,
    izin_ortu: null
  });
  
  const [filePreviews, setFilePreviews] = useState({});
  const [fileProgress, setFileProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'gender') {
        newData.tinggi_badan = '';
      }
      return newData;
    });
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    
    if (filePreviews[fieldName] && filePreviews[fieldName] !== 'pdf') {
      URL.revokeObjectURL(filePreviews[fieldName]);
    }
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
    setFileProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fieldName];
      return newProgress;
    });
  };

  const handleFileSelect = (arg1, arg2) => {
    let fieldName, file;

    // Support both (file, fieldName) from FileUpload component or (fieldName, file)
    if (typeof arg1 === 'string' || arg1 === null || arg1 === undefined) {
      fieldName = arg1;
      file = arg2;
    } else {
      file = arg1;
      fieldName = arg2;
    }

    if (!file) {
      if (fieldName) removeFile(fieldName);
      return;
    }

    const fileError = validateFile(file);
    if (fileError) {
      setErrors((prev) => ({ ...prev, [fieldName]: fileError }));
      return;
    }

    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews((prev) => ({ ...prev, [fieldName]: previewUrl }));
    } else {
      setFilePreviews((prev) => ({ ...prev, [fieldName]: 'pdf' }));
    }
    
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleAgreedChange = (e) => {
    setAgreed(e.target.checked);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitError(null);
    
    if (!agreed) {
      setSubmitError('Anda harus menyetujui syarat dan ketentuan sebelum mendaftar.');
      return false;
    }

    const formErrors = validateRegistrationForm(formData);
    
    const fileRequirements = ['ktp', 'akta', 'kk', 'ijazah', 'izin_ortu'];
    fileRequirements.forEach(req => {
      if (!files[req]) {
        formErrors[req] = 'File ini wajib diunggah';
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      const firstErrorKey = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    setIsSubmitting(true);
    
    try {
      const folderName = formData.nama.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const uploadedFileUrls = {};

      const uploadPromises = Object.keys(files).map(async (key) => {
        const file = files[key];
        if (!file) return;

        const path = generateFilePath(folderName, `${key}_${file.name}`);
        const url = await uploadFile(file, path, (progress) => {
          setFileProgress((prev) => ({ ...prev, [key]: progress }));
        });
        uploadedFileUrls[key] = url;
      });

      await Promise.all(uploadPromises);

      const submissionData = {
        nama: formData.nama,
        no_hp: formData.no_hp,
        email: formData.email,
        gender: formData.gender,
        tinggi_badan: parseInt(formData.tinggi_badan, 10),
        usia: parseInt(formData.usia, 10),
        alamat: formData.alamat,
        url_ktp: uploadedFileUrls.ktp || '',
        url_akta: uploadedFileUrls.akta || '',
        url_kk: uploadedFileUrls.kk || '',
        url_ijazah: uploadedFileUrls.ijazah || '',
        url_izin_ortu: uploadedFileUrls.izin_ortu || '',
      };

      // Send Telegram notification (guaranteed to run once files are uploaded)
      await sendTelegramNotification(submissionData);

      // Save to Firestore (non-blocking if Firestore security rules are pending setup)
      try {
        await submitRegistration(submissionData);
      } catch (dbError) {
        console.warn('Firestore write warning (rules may be in test mode):', dbError);
      }
      
      navigate('/pendaftaran/sukses', { replace: true });
      return true;
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(
        error.message || 'Terjadi kesalahan saat mengirim data. Silakan coba lagi.'
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    files,
    filePreviews,
    fileProgress,
    errors,
    isSubmitting,
    submitError,
    agreed,
    handleChange,
    handleFileSelect,
    removeFile,
    handleAgreedChange,
    handleSubmit
  };
};
