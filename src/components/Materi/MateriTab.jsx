import MateriCard from './MateriCard';

export default function MateriTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Kartu Materi Jaringan Komputer */}
      <MateriCard
        title="Jaringan Komputer"
        description="Pelajari konsep dasar jaringan, topologi, dan cara komputer saling berkomunikasi."
        type="link"
        color="blue"
        onOpen={() => window.open('https://mediapembelajarantekscerpenkelasixsmp.my.canva.site/c54xpr3xwymkfzrh', '_blank')}
      />

      {/* Kartu Materi Konektivitas Jaringan */}
      <MateriCard
        title="Konektivitas Jaringan"
        description="Memahami cara perangkat terhubung ke internet, teknologi nirkabel, dan protokol komunikasi."
        type="link"
        color="emerald"
        onOpen={() => window.open('https://mediapembelajarantekscerpenkelasixsmp.my.canva.site/c5ynsts7fr4sb7sw', '_blank')}
      />

      {/* Kartu Materi Proteksi Data dan File */}
      <MateriCard
        title="Proteksi Data dan File"
        description="Pelajari cara mengamankan data pribadi, enkripsi file, dan praktik terbaik menjaga keamanan informasi di ruang digital."
        type="link"
        color="purple"
        onOpen={() => window.open('https://mediapembelajarantekscerpenkelasixsmp.my.canva.site/c6k759qg5av7m746', '_blank')}
      />
    </div>
  );
}