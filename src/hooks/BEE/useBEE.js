import { useState, useEffect } from 'react';
import ecoImg from '../../assets/BEE/eco.png';
import faceImg from '../../assets/BEE/face_recognition.png';
import fluppyImg from '../../assets/BEE/fluppy.png';
import neonBlockImg from '../../assets/BEE/neon_block_breaker.png';

const ternakImg = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400";
const typingImg = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400";



export const useBEE = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi data contoh dari siswa
    const dummyData = [
      {
        id: 1,
        title: "EcoQ",
        creator_name: "Desak Made Arista Felicia",
        category: "Game",
        description: "Game edukasi interaktif Scratch bertema lingkungan dan keberlanjutan.",
        image_url: ecoImg,
        link: "https://scratch.mit.edu/projects/1219925851"
      },
      {
        id: 2,
        title: "T.E.R.n.A.K",
        creator_name: "Komang Indah Trisna Ningsih",
        category: "Game",
        description: "Teknologi Edukasi Remaja untuk Navigasi Aman Komunikasi. Simulasi peternakan untuk pencegahan Cyber Child Grooming.",
        image_url: ternakImg,
        link: "https://view.genially.com/69b780ba5871e2285c11952e"
      },

      {
        id: 102,
        title: "Flappy Bird Quiz Informatika",
        creator_name: "KADEK KIRANA SUPARMITHA MAHESTRI",
        category: "Game",
        description: "Game Flappy Bird edukasi informatika di mana pemain harus menghindari rintangan. Jika menabrak tembok, pemain akan mendapatkan pertanyaan quiz informatika untuk melanjutkan permainan.",
        image_url: "https://photos5.appleinsider.com/gallery/61043-125907-generatedwithbing-xl.jpg",
        link: "/flappy.html" // File berada di folder public
      },

      {
        id: 103,
        title: "Game Ketik Cepat",
        creator_name: "MADE DIYONANDA FEBRIYANA SUKKE",
        category: "Game",
        description: "Permainan interaktif untuk melatih kecepatan mengetik, akurasi, dan konsentrasi dalam mengetik kata-kata dengan cepat dan tepat.",
        image_url: "https://assets.parroto.app/assets/game/game1.webp",
        link: "/typing-challenge" // Diarahkan ke route internal
      },

      {
        id: 104,
        title: "Game Catur",
        creator_name: "KETUT PASEK ADI WIGUNA",
        category: "Game",
        description: "Permainan catur interaktif yang memungkinkan pemain mengasah strategi, logika, dan kemampuan berpikir beberapa langkah ke depan.",
        image_url: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=400",
        link: "/chess.html" // File berada di folder public
      },

      {
        id: 105,
        title: "Feeding Frenzy: Samudra Spendaraja",
        creator_name: "GEDE AGYA PARILAKSANA",
        category: "Game",
        description: "Game petualangan bawah laut klasik GameHouse. Mangsa ikan kecil untuk berevolusi, kumpulkan mutiara karang Lovina, hindari predator raksasa, dan raih kombo Feeding Frenzy!",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgu2e4v1Picl7iSPqCUdvFV-_ygB53bJ6INS920L1G-g&s=10",
        link: "/models/feeding-frenzy.html" // File berada di folder public/models dan dist/models
      },

      {
        id: 106,
        title: "Zuma Deluxe: Kuil Spendaraja",
        creator_name: "PUTU ANGGITA KIRANA PUTRI",
        category: "Game",
        description: "Game arcade teka-teki legendaris GameHouse. Kendalikan Katak Penjaga mistis, bidik kelereng warna-warni, ciptakan kombo beruntun berantai, dan cegah bola jatuh ke mulut tengkorak!",
        image_url: "https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/41c50b9c-96d2-11e6-938d-00163ed833e7/2720894789/zuma-screenshot.jpg",
        link: "/models/zuma-deluxe.html" // File berada di folder public/models dan dist/models
      },

      {
        id: 107,
        title: "Neon Block Breaker",
        creator_name: "GEDE ANANDA PRATAMA ARDIANA",
        category: "Game",
        description: "Game arcade pemecah balok berangka bergaya neon futuristik. Tembakkan bola pantul, bidik sudut pantulan yang tepat, kumpulkan bola ekstra, dan hancurkan balok angka sebelum menyentuh batas bawah!",
        image_url: neonBlockImg,
        link: "/neon_block_breaker_berangka.html"
      },

      {
        id: 101,
        title: "Absensi Face Recognition",
        creator_name: "Project kelas 7.1",
        category: "App",
        description: "Prototipe sistem absensi masa depan menggunakan pengenalan wajah untuk keamanan sekolah.",
        image_url: faceImg,
        link: "/face-absen" // Diarahkan ke route internal
      }
    ];

    setTimeout(() => {
      setWorks(dummyData);
      setLoading(false);
    }, 800);
  }, []);

  return { works, loading };
};