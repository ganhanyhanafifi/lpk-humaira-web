const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();

const TELEGRAM_BOT_TOKEN = defineSecret('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = defineSecret('TELEGRAM_CHAT_ID');

exports.onNewRegistration = onDocumentCreated(
  {
    document: 'pendaftaran_mahasiswa_baru/{docId}',
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const data = snapshot.data();
    const docRef = snapshot.ref;

    try {
      // Server-side validation
      const errors = [];
      
      if (!data.nama || typeof data.nama !== 'string' || data.nama.length >= 100) {
        errors.push('Nama invalid');
      }
      
      const phoneRegex = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/;
      const isPhoneValid = data.no_hp && typeof data.no_hp === 'string' && (phoneRegex.test(data.no_hp) || data.no_hp.length >= 9);
      if (!isPhoneValid) {
        errors.push('No HP invalid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
        errors.push('Email invalid');
      }

      if (data.gender !== 'Laki-laki' && data.gender !== 'Perempuan') {
        errors.push('Gender invalid');
      }

      if (typeof data.tinggi_badan !== 'number' || data.tinggi_badan < 100 || data.tinggi_badan > 300) {
        errors.push('Tinggi badan invalid');
      }

      if (typeof data.usia !== 'number' || data.usia < 18 || data.usia > 35) {
        errors.push('Usia invalid');
      }

      if (errors.length > 0) {
        console.error('Validation failed:', errors.join(', '));
        await docRef.update({ status: 'invalid', validationErrors: errors });
        return;
      }

      const dateOpts = { timeZone: 'Asia/Jakarta', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const formattedDate = new Date().toLocaleString('id-ID', dateOpts) + ' WIB';

      const message = `📋 <b>PENDAFTARAN BARU — LPK Humaira Institute</b>\n\n👤 <b>Nama:</b> ${data.nama}\n📱 <b>No HP:</b> ${data.no_hp}\n📧 <b>Email:</b> ${data.email}\n⚧ <b>Gender:</b> ${data.gender}\n📏 <b>Tinggi Badan:</b> ${data.tinggi_badan} cm\n🎂 <b>Usia:</b> ${data.usia} tahun\n🏠 <b>Alamat:</b> ${data.alamat || '-'}\n\n📎 <b>Dokumen:</b>\n• <a href="${data.url_ktp || '#'}">KTP</a>\n• <a href="${data.url_akta || '#'}">Akta Kelahiran</a>\n• <a href="${data.url_kk || '#'}">Kartu Keluarga</a>\n• <a href="${data.url_ijazah || '#'}">Ijazah</a>\n• <a href="${data.url_izin_ortu || '#'}">Surat Izin Orang Tua</a>\n\n🕐 <b>Waktu daftar:</b> ${formattedDate}`;

      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN.value()}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID.value(),
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      if (response.ok) {
        await docRef.update({ status: 'notified' });
      } else {
        const errText = await response.text();
        console.error('Telegram API error:', errText);
        await docRef.update({ status: 'telegram_failed' });
      }
    } catch (error) {
      console.error('Error processing registration:', error);
      await docRef.update({ status: 'error', errorMessage: error.message });
    }
  }
);
