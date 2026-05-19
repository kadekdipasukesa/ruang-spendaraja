import { useState, useEffect } from 'react';
import ecoImg from '../../assets/BEE/eco.png';
import ternakImg from '../../assets/BEE/ternak.png';
import faceImg from '../../assets/BEE/face_recognition.png';
import fluppyImg from '../../assets/BEE/fluppy.png';
import typingImg from '../../assets/BEE/ketik_cepat.png';



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
        creator_name: "MICHAEL YAP SUGIANTO",
        category: "Game",
        description: "Game Flappy Bird edukasi informatika di mana pemain harus menghindari rintangan. Jika menabrak tembok, pemain akan mendapatkan pertanyaan quiz informatika untuk melanjutkan permainan.",
        image_url: fluppyImg,
        link: "/flappy.html" // File berada di folder public
      },

      {
        id: 103,
        title: "Game Ketik Cepat",
        creator_name: "MADE DIYONANDA FEBRIYANA SUKKE",
        category: "Game",
        description: "Permainan interaktif untuk melatih kecepatan mengetik, akurasi, dan konsentrasi dalam mengetik kata-kata dengan cepat dan tepat.",
        image_url: typingImg,
        link: "/typing-challenge" // Diarahkan ke route internal
      },

      {
        id: 104,
        title: "Game Catur",
        creator_name: "SAMUEL HOSENA",
        category: "Game",
        description: "Permainan catur interaktif yang memungkinkan pemain mengasah strategi, logika, dan kemampuan berpikir beberapa langkah ke depan.",
        image_url: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=400",
        link: "/chess.html" // File berada di folder public
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