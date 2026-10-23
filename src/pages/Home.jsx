// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { daftarMajalah } from '../data/majalah';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Majalah Sekolah</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {daftarMajalah.map((majalah) => (
          <Link 
            key={majalah.id} 
            to={`/majalah/${majalah.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
          >
            <img 
              src={majalah.cover} 
              alt={majalah.judul} 
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg">{majalah.judul}</h2>
              <p className="text-sm text-gray-500">{majalah.edisi}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;