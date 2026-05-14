import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

export const useFaceAbsen = () => {
  const videoRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [labeledDescriptors, setLabeledDescriptors] = useState([]);
  const [scanning, setScanning] = useState(false);

   // FUNGSI SUARA (Text to Speech)
   const speak = (text) => {
    // Batalkan suara sebelumnya agar tidak tumpang tindih
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Set Bahasa Indonesia
    utterance.rate = 1.0;     // Kecepatan bicara
    utterance.pitch = 1.2;    // Nada (agak tinggi agar ramah)
    
    window.speechSynthesis.speak(utterance);
  };

  // Load Models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL) // Butuh ini untuk akurasi daftar
      ]);
      setIsModelLoaded(true);
      
      // Load data wajah yang sudah tersimpan di browser
      const savedFaces = localStorage.getItem('spenda_faces');
      if (savedFaces) {
        const parsed = JSON.parse(savedFaces).map(f => {
          return new faceapi.LabeledFaceDescriptors(f.label, [new Float32Array(f.descriptors[0])]);
        });
        setLabeledDescriptors(parsed);
      }
    };
    loadModels();
  }, []);

  // 2. Loop Deteksi Real-time
  useEffect(() => {
    let interval;
    if (scanning && isModelLoaded && labeledDescriptors.length > 0) {
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

      interval = setInterval(async () => {
        if (!videoRef.current) return;

        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        detections.forEach(fd => {
          const match = faceMatcher.findBestMatch(fd.descriptor);
          if (match.label !== 'unknown') {
            handleAutoAbsen(match.label);
          }
        });
      }, 2000); // Cek setiap 2 detik agar tidak berat
    }
    return () => clearInterval(interval);
  }, [scanning, isModelLoaded, labeledDescriptors]);

  // 1. Logika saat wajah dikenali otomatis
  const handleAutoAbsen = (name) => {
    const time = new Date().toLocaleTimeString();
    setAttendanceList(prev => {
      // Cek agar tidak menyapa orang yang sama berulang-ulang dalam waktu dekat
      if (prev.length > 0 && prev[0].name === name) return prev; 
      
      // SUARA: Halo [Nama] sudah berhasil absen
      speak(`Halo ${name}, kamu sudah berhasil absen.`);
      
      return [{ name, time }, ...prev].slice(0, 5);
    });
  };

  const startVideo = () => {
    setScanning(true);
    navigator.mediaDevices.getUserMedia({ video: {} }).then(s => videoRef.current.srcObject = s);
  };

  // FUNGSI DAFTAR WAJAH BARU
  // 2. Logika saat mendaftarkan wajah baru
  const registerFace = async (name) => {
    if (!name) return alert("Masukkan nama dulu!");
    if (!videoRef.current) return;
    
    const detection = await faceapi.detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      const newDescriptor = new faceapi.LabeledFaceDescriptors(name, [detection.descriptor]);
      const updatedList = [...labeledDescriptors, newDescriptor];
      setLabeledDescriptors(updatedList);
      
      const toSave = updatedList.map(ld => ({
        label: ld.label,
        descriptors: ld.descriptors.map(d => Array.from(d))
      }));
      localStorage.setItem('spenda_faces', JSON.stringify(toSave));
      
      // SUARA: Halo [Nama] sudah terdaftar
      speak(`Halo ${name}, wajahmu sudah berhasil terdaftar di sistem Spenda.`);
      
      alert(`Wajah ${name} berhasil didaftarkan!`);
    } else {
      speak("Maaf, wajah tidak terdeteksi. Tolong lebih dekat ke kamera.");
    }
  };

 

  return { videoRef, isModelLoaded, startVideo, attendanceList, setAttendanceList, scanning, registerFace, labeledDescriptors };
};