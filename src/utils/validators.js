/**
 * Validates Indonesian phone format (08xx, +628xx, etc.)
 * @param {string} phone 
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return 'Nomor HP wajib diisi';
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  if (!/^(\+?62|0)[0-9]{8,13}$/.test(cleanPhone)) {
    return 'Format nomor HP tidak valid. Gunakan format 08xx atau +628xx';
  }
  return null;
};

/**
 * Validates standard email format
 * @param {string} email 
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) return 'Email wajib diisi';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Format email tidak valid';
  }
  return null;
};

/**
 * Validates height based on gender requirements
 * @param {string|number} height 
 * @param {string} gender 
 * @returns {string|null} Error message or null if valid
 */
export const validateHeightForGender = (height, gender) => {
  if (!height) return 'Tinggi badan wajib diisi';
  const h = Number(height);
  if (isNaN(h)) return 'Tinggi badan harus berupa angka';
  
  if (gender === 'Laki-laki') {
    if (h < 160) return 'Tinggi badan minimal untuk Laki-laki adalah 160 cm';
  } else if (gender === 'Perempuan') {
    if (h < 155) return 'Tinggi badan minimal untuk Perempuan adalah 155 cm';
  } else {
    return 'Pilih jenis kelamin terlebih dahulu';
  }
  
  if (h > 300) return 'Tinggi badan tidak valid';
  return null;
};

/**
 * Validates age requirements (18-35)
 * @param {string|number} age 
 * @returns {string|null} Error message or null if valid
 */
export const validateAge = (age) => {
  if (!age) return 'Usia wajib diisi';
  const a = Number(age);
  if (isNaN(a)) return 'Usia harus berupa angka';
  if (a < 18 || a > 35) return 'Usia harus antara 18 hingga 35 tahun';
  return null;
};

/**
 * Validates file type and size
 * @param {File} file 
 * @param {number} maxSizeMB 
 * @returns {string|null} Error message or null if valid
 */
export const validateFile = (file, maxSizeMB = 5) => {
  if (!file) return 'File wajib diunggah';
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return 'Format file harus JPG, JPEG, PNG, atau PDF';
  }
  
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return `Ukuran file maksimal adalah ${maxSizeMB}MB`;
  }
  
  return null;
};

/**
 * Validates entire registration form data
 * @param {Object} formData 
 * @returns {Object} Object with field keys and error messages
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  if (!formData.nama?.trim()) errors.nama = 'Nama lengkap wajib diisi';
  if (!formData.alamat?.trim()) errors.alamat = 'Alamat lengkap wajib diisi';
  if (!formData.gender) errors.gender = 'Jenis kelamin wajib dipilih';
  
  const phoneError = validatePhone(formData.no_hp);
  if (phoneError) errors.no_hp = phoneError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  if (formData.gender) {
    const heightError = validateHeightForGender(formData.tinggi_badan, formData.gender);
    if (heightError) errors.tinggi_badan = heightError;
  } else {
    errors.tinggi_badan = 'Pilih jenis kelamin terlebih dahulu';
  }
  
  const ageError = validateAge(formData.usia);
  if (ageError) errors.usia = ageError;
  
  return errors;
};

/**
 * Returns height options based on gender
 * @param {string} gender 
 * @returns {number[]} Array of valid heights
 */
export const getHeightOptions = (gender) => {
  const options = [];
  if (gender === 'Laki-laki') {
    for (let i = 160; i <= 300; i++) options.push(i);
  } else if (gender === 'Perempuan') {
    for (let i = 155; i <= 300; i++) options.push(i);
  }
  return options;
};

/**
 * Returns valid age options (18-35)
 * @returns {number[]} Array of valid ages
 */
export const getAgeOptions = () => {
  const options = [];
  for (let i = 18; i <= 35; i++) {
    options.push(i);
  }
  return options;
};
