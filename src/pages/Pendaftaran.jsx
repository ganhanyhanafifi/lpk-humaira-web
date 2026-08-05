import React from 'react';
import FormInput from '../components/FormInput';
import FileUpload from '../components/FileUpload';
import WarningBox from '../components/WarningBox';
import StepTimeline from '../components/StepTimeline';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { getHeightOptions, getAgeOptions } from '../utils/validators';

const Pendaftaran = () => {
  const { 
    formData, 
    files,
    errors, 
    fileProgress, 
    filePreviews, 
    handleChange, 
    handleFileSelect, 
    handleSubmit, 
    isSubmitting, 
    submitError,
    agreed,
    handleAgreedChange
  } = useRegistrationForm();

  const heightOptions = getHeightOptions(formData.gender).map(h => ({
    value: h.toString(),
    label: `${h} cm`
  }));

  const ageOptions = getAgeOptions().map(a => ({
    value: a.toString(),
    label: `${a} Tahun`
  }));

  const steps = [
    { label: 'Isi Data Diri', isCompleted: Boolean(formData.nama && formData.no_hp && formData.email && formData.gender), isActive: true },
    { label: 'Upload Dokumen', isCompleted: Object.keys(filePreviews).length === 5, isActive: Boolean(formData.nama && formData.no_hp) },
    { label: 'Submit Pendaftaran', isCompleted: false, isActive: Object.keys(filePreviews).length === 5 }
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="py-12 md:py-16 pb-20 bg-gradient-to-r from-primary-800 to-primary-600 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white animate-slide-up">
            Formulir Pendaftaran Mahasiswa Baru
          </h1>
          <p className="text-gray-100 mt-2 text-sm md:text-base">LPK Humaira Institute — Pelatihan & Penyaluran Kerja ke Jepang</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white shadow-2xl rounded-3xl p-6 md:p-12">
          
          <StepTimeline steps={steps} />
          
          {submitError && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-medium">
              ⚠️ Terjadi kesalahan: {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Data Diri */}
            <section>
              <h2 className="text-2xl font-bold font-heading text-dark mb-6 pb-2 border-b-2 border-gray-100 flex items-center">
                <span className="mr-3">📋</span> Data Diri
              </h2>
              
              <div className="space-y-6">
                <FormInput 
                  label="Nama Lengkap" 
                  name="nama" 
                  type="text"
                  value={formData.nama}
                  onChange={handleChange}
                  error={errors.nama}
                  required
                  placeholder="Sesuai KTP"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="No HP/WhatsApp Active" 
                    name="no_hp" 
                    type="tel"
                    value={formData.no_hp}
                    onChange={handleChange}
                    error={errors.no_hp}
                    required
                    placeholder="081234567890"
                  />
                  <FormInput 
                    label="Email" 
                    name="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    placeholder="email@contoh.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-all ${
                      formData.gender === 'Laki-laki' 
                        ? 'border-primary-700 bg-primary-50 text-primary-800 shadow-sm font-semibold' 
                        : 'border-gray-200 hover:border-primary-300'
                    }`}>
                      <input 
                        type="radio" 
                        name="gender" 
                        value="Laki-laki" 
                        checked={formData.gender === 'Laki-laki'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <svg className={`w-6 h-6 shrink-0 ${formData.gender === 'Laki-laki' ? 'text-primary-700' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M21 3l-7 7M10 14a5 5 0 100-10 5 5 0 000 10z" />
                      </svg>
                      <span>Laki-laki</span>
                    </label>
                    <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-all ${
                      formData.gender === 'Perempuan' 
                        ? 'border-primary-700 bg-primary-50 text-primary-800 shadow-sm font-semibold' 
                        : 'border-gray-200 hover:border-primary-300'
                    }`}>
                      <input 
                        type="radio" 
                        name="gender" 
                        value="Perempuan" 
                        checked={formData.gender === 'Perempuan'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <svg className={`w-6 h-6 shrink-0 ${formData.gender === 'Perempuan' ? 'text-primary-700' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a5 5 0 100-10 5 5 0 000 10zM12 14v7M9 18h6" />
                      </svg>
                      <span>Perempuan</span>
                    </label>
                  </div>
                  {errors.gender && <p className="mt-2 text-sm text-red-500 font-medium">{errors.gender}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="Tinggi Badan (cm)" 
                    name="tinggi_badan" 
                    type="select"
                    value={formData.tinggi_badan}
                    onChange={handleChange}
                    error={errors.tinggi_badan}
                    required
                    disabled={!formData.gender}
                    options={heightOptions}
                    placeholder={formData.gender ? "Pilih Tinggi Badan" : "Pilih jenis kelamin dulu"}
                  />
                  <FormInput 
                    label="Usia (Tahun)" 
                    name="usia" 
                    type="select"
                    value={formData.usia}
                    onChange={handleChange}
                    error={errors.usia}
                    required
                    options={ageOptions}
                    placeholder="Pilih Usia (18-35 Thn)"
                  />
                </div>

                <FormInput 
                  label="Alamat Domisili Lengkap" 
                  name="alamat" 
                  type="textarea"
                  value={formData.alamat}
                  onChange={handleChange}
                  error={errors.alamat}
                  required
                  placeholder="Alamat lengkap beserta RT/RW, Kelurahan, Kecamatan, dan Kota/Kabupaten"
                />
              </div>
            </section>

            {/* Section 2: Upload Dokumen */}
            <section>
              <div className="mb-6 pb-2 border-b-2 border-gray-100">
                <h2 className="text-2xl font-bold font-heading text-dark flex items-center mb-1">
                  <span className="mr-3">📎</span> Upload Dokumen
                </h2>
                <p className="text-sm text-gray-500">Semua dokumen wajib diupload. Format: JPG, PNG, atau PDF. Maksimal 5MB per file.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload 
                  label="1. Foto KTP" 
                  name="ktp" 
                  accept="image/jpeg, image/png, application/pdf"
                  maxSize={5}
                  onFileSelect={handleFileSelect}
                  file={files.ktp}
                  progress={fileProgress.ktp}
                  error={errors.ktp}
                  preview={filePreviews.ktp}
                />
                <FileUpload 
                  label="2. Foto Akta Kelahiran" 
                  name="akta" 
                  accept="image/jpeg, image/png, application/pdf"
                  maxSize={5}
                  onFileSelect={handleFileSelect}
                  file={files.akta}
                  progress={fileProgress.akta}
                  error={errors.akta}
                  preview={filePreviews.akta}
                />
                <FileUpload 
                  label="3. Foto Kartu Keluarga (KK)" 
                  name="kk" 
                  accept="image/jpeg, image/png, application/pdf"
                  maxSize={5}
                  onFileSelect={handleFileSelect}
                  file={files.kk}
                  progress={fileProgress.kk}
                  error={errors.kk}
                  preview={filePreviews.kk}
                />
                <FileUpload 
                  label="4. Foto Ijazah SMA/SMK" 
                  name="ijazah" 
                  accept="image/jpeg, image/png, application/pdf"
                  maxSize={5}
                  onFileSelect={handleFileSelect}
                  file={files.ijazah}
                  progress={fileProgress.ijazah}
                  error={errors.ijazah}
                  preview={filePreviews.ijazah}
                />
                <FileUpload 
                  label="5. Surat Izin Orang Tua/Pasangan" 
                  name="izin_ortu" 
                  accept="image/jpeg, image/png, application/pdf"
                  maxSize={5}
                  onFileSelect={handleFileSelect}
                  file={files.izin_ortu}
                  progress={fileProgress.izin_ortu}
                  error={errors.izin_ortu}
                  preview={filePreviews.izin_ortu}
                />
              </div>
            </section>

            {/* Section 3: WarningBox */}
            <WarningBox />

            {/* Section 4: Checkbox agreement */}
            <section className="bg-red-50/50 p-6 rounded-2xl border-2 border-red-200">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="pt-1">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-primary-700 border-primary-700' : 'border-gray-400 group-hover:border-primary-500 bg-white'}`}>
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={agreed}
                      onChange={handleAgreedChange}
                    />
                    {agreed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  Saya menyatakan tidak memiliki kondisi fisik yang disebutkan di atas dan seluruh data yang saya isi adalah benar serta dapat dipertanggungjawabkan.
                </p>
              </label>
            </section>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!agreed || isSubmitting}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white py-4 px-6 text-lg font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-300 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengunggah Dokumen & Mengirim Data...
                  </>
                ) : (
                  'DAFTAR SEKARANG DISINI!'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pendaftaran;
