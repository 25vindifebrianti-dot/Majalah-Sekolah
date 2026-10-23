// src/pages/FlipbookPage.jsx
import { useParams, Link } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { daftarMajalah } from '../data/majalah';

function FlipbookPage() {
  const { id } = useParams();
  const majalah = daftarMajalah.find(m => m.id === id);

  if (!majalah) {
    return <div className="p-8 text-center">Majalah tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-4 text-white hover:text-gray-300">
        &larr; Kembali ke Daftar Majalah
      </Link>
      
      {/* Komponen Flipbook */}
      <HTMLFlipBook 
        width={550} 
        height={733} 
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        showCover={true}
        mobileScrollSupport={true}
        className="shadow-2xl"
      >
        {majalah.halaman.map((gambar, index) => (
          <div key={index} className="bg-white">
            <img 
              src={gambar} 
              alt={`Halaman ${index + 1}`} 
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </HTMLFlipBook>
      
      <p className="mt-4 text-gray-400 text-sm">
        Klik sudut halaman atau geser untuk membalik.
      </p>
    </div>
  );
}

export default FlipbookPage;