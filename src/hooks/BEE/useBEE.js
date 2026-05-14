import { useState, useEffect } from 'react';
import ecoImg from '../../assets/BEE/eco.png';
import ternakImg from '../../assets/BEE/ternak.png';


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
        id: 3,
        title: "Game Labirin Informatika",
        creator_name: "Gede Aris Sugiantara",
        category: "Game",
        description: "Game edukasi logika pemrograman untuk anak SMP menggunakan Scratch.",
        image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400",
        link: "https://scratch.mit.edu" // Contoh Link
      },
      {
        id: 4,
        title: "E-Library Spenda",
        creator_name: "Putu Ayu Lestari",
        category: "App",
        description: "Prototipe aplikasi perpustakaan digital untuk mempermudah peminjaman buku.",
        image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400",
        link: "https://www.figma.com" // Contoh Link
      },
      {
        id: 5,
        title: "Robot Penyiram Tanaman Otomatis",
        creator_name: "Kadek Dwi Pratama",
        category: "IoT",
        description: "Inovasi sistem penyiraman taman sekolah berbasis sensor kelembaban tanah.",
        image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400",
        link: "https://google.com" // Contoh Link
      },
      {
        id: 6,
        title: "Web Portofolio Digital",
        creator_name: "Komang Indah Wahyuni",
        category: "Web",
        description: "Kumpulan karya desain grafis dan coding HTML/CSS dasar.",
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400",
        link: "https://vercel.com" // Contoh Link
      },
      {
        id: 101,
        title: "Absensi Face Recognition",
        creator_name: "Project kelas 7.1",
        category: "App",
        description: "Prototipe sistem absensi masa depan menggunakan pengenalan wajah untuk keamanan sekolah.",
        image_url: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=400",
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