import { useState, useEffect } from 'react';

export const useBEE = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi data contoh dari siswa
    const dummyData = [
      {
        id: 1,
        title: "Game Labirin Informatika",
        creator_name: "Gede Aris Sugiantara",
        category: "Game",
        description: "Game edukasi logika pemrograman untuk anak SMP menggunakan Scratch.",
        image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400",
        link: "https://scratch.mit.edu" // Contoh Link
      },
      {
        id: 2,
        title: "E-Library Spenda",
        creator_name: "Putu Ayu Lestari",
        category: "App",
        description: "Prototipe aplikasi perpustakaan digital untuk mempermudah peminjaman buku.",
        image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400",
        link: "https://www.figma.com" // Contoh Link
      },
      {
        id: 3,
        title: "Robot Penyiram Tanaman Otomatis",
        creator_name: "Kadek Dwi Pratama",
        category: "IoT",
        description: "Inovasi sistem penyiraman taman sekolah berbasis sensor kelembaban tanah.",
        image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400",
        link: "https://google.com" // Contoh Link
      },
      {
        id: 4,
        title: "Web Portofolio Digital",
        creator_name: "Komang Indah Wahyuni",
        category: "Web",
        description: "Kumpulan karya desain grafis dan coding HTML/CSS dasar.",
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400",
        link: "https://vercel.com" // Contoh Link
      }
    ];

    setTimeout(() => {
      setWorks(dummyData);
      setLoading(false);
    }, 800);
  }, []);

  return { works, loading };
};