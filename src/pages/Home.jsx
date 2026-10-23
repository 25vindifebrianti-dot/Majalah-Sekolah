import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { daftarMajalah } from '../data/majalah';

const judulFont = "font-['Bricolage_Grotesque']";

/* ---------- Sampul majalah (dengan punggung buku) ---------- */
function Sampul({ majalah, className = '' }) {
  const [gagal, setGagal] = useState(false);

  return (
    <div
      className={`relative aspect-[3/4] overflow-hidden rounded-l-sm rounded-r-lg bg-[#1E1B4B] shadow-[0_22px_45px_-14px_rgba(30,27,75,0.6)] ${className}`}
    >
      {gagal ? (
        <div className="flex h-full items-end p-5">
          <span className={`${judulFont} text-xl font-bold leading-tight text-white`}>
            {majalah.judul}
          </span>
        </div>
      ) : (
        <img
          src={majalah.cover}
          alt={`Sampul ${majalah.judul}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setGagal(true)}
        />
      )}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-4 w-px bg-white/30" />
    </div>
  );
}

/* ---------- Navbar ---------- */
function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1E1B4B]/10 bg-[#F3F2FB]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className={`${judulFont} text-xl font-extrabold tracking-tight`}>
          Majalah Sekolah
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#terbaru" className="hover:text-[#FF5A5F]">Edisi terbaru</a>
          <a href="#arsip" className="hover:text-[#FF5A5F]">Arsip</a>
          <a href="#cara-baca" className="hover:text-[#FF5A5F]">Cara membaca</a>
        </nav>
        <a
          href="#arsip"
          className="rounded-full bg-[#1E1B4B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#FF5A5F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]"
        >
          Mulai baca
        </a>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero({ daftar }) {
  const tumpuk = daftar.slice(0, 3);
  // posisi & rotasi tiap sampul dalam tumpukan
  const gaya = [
    'left-[4%] top-[14%] w-[44%] -rotate-[8deg] z-10',
    'left-[28%] top-[2%] w-[46%] rotate-[3deg] z-20',
    'right-[2%] top-[18%] w-[42%] rotate-[10deg] z-10',
  ];

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-24 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <h1 className={`${judulFont} text-5xl font-extrabold leading-[1.0] tracking-tight sm:text-6xl lg:text-[5.25rem]`}>
            Semua cerita sekolah, dalam satu rak digital.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#1E1B4B]/70">
            Buka majalah, balik halamannya seperti buku sungguhan, dan baca karya
            serta liputan teman-temanmu dari HP maupun laptop.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            {daftar[0] && (
              <Link
                to={`/majalah/${daftar[0].id}`}
                className="rounded-full bg-[#FF5A5F] px-8 py-4 font-semibold text-white shadow-lg shadow-[#FF5A5F]/30 transition hover:bg-[#f0484d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1B4B]"
              >
                Baca edisi terbaru
              </Link>
            )}
            <a
              href="#arsip"
              className="rounded-full px-8 py-4 font-semibold ring-1 ring-[#1E1B4B]/25 transition hover:bg-[#1E1B4B] hover:text-white"
            >
              Lihat semua edisi
            </a>
          </div>
        </div>

        {/* Tumpukan sampul */}
        <div className="relative mx-auto h-[380px] w-full max-w-md sm:h-[460px]">
          <div className="absolute inset-x-6 bottom-2 top-10 rounded-[2.5rem] bg-[#FFC531]" />
          {tumpuk.map((m, i) => (
            <Link
              key={m.id}
              to={`/majalah/${m.id}`}
              aria-label={`Buka ${m.judul}`}
              className={`absolute transition-transform duration-500 hover:-translate-y-3 ${gaya[i]}`}
            >
              <Sampul majalah={m} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Alasan membaca di sini ---------- */
function Keunggulan() {
  const daftar = [
    {
      judul: 'Tampilan seperti buku asli',
      isi: 'Halaman bisa dibalik dengan geser, klik, atau tombol panah di keyboard.',
    },
    {
      judul: 'Bisa dibaca di mana saja',
      isi: 'Di laptop buku terbuka dua halaman, di HP otomatis jadi satu halaman.',
    },
    {
      judul: 'Semua edisi tersimpan',
      isi: 'Edisi lama tetap ada di arsip, tinggal pilih dan baca kapan saja.',
    },
  ];

  return (
    <section className="border-y border-[#1E1B4B]/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 md:gap-0">
        {daftar.map((d, i) => (
          <div
            key={d.judul}
            className={`md:px-8 ${i === 0 ? 'md:pl-0' : 'md:border-l md:border-[#1E1B4B]/10'}`}
          >
            <h3 className={`${judulFont} text-xl font-bold`}>{d.judul}</h3>
            <p className="mt-2 leading-relaxed text-[#1E1B4B]/65">{d.isi}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Edisi terbaru ---------- */
function EdisiTerbaru({ majalah }) {
  if (!majalah) return null;

  return (
    <section id="terbaru" className="bg-[#1E1B4B] text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[0.8fr_1.2fr]">
        <Link
          to={`/majalah/${majalah.id}`}
          aria-label={`Buka ${majalah.judul}`}
          className="mx-auto block w-full max-w-xs transition-transform duration-500 hover:-rotate-2 hover:scale-[1.03]"
        >
          <Sampul majalah={majalah} />
        </Link>

        <div>
          <p className="text-sm font-medium text-[#FFC531]">Edisi terbaru, {majalah.edisi}</p>
          <h2 className={`${judulFont} mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl`}>
            {majalah.judul}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
            {majalah.deskripsi ||
              'Kumpulan liputan, karya, dan cerita terbaru dari seluruh penjuru sekolah.'}
          </p>
          <Link
            to={`/majalah/${majalah.id}`}
            className="mt-8 inline-block rounded-full bg-[#FFC531] px-8 py-4 font-semibold text-[#1E1B4B] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Buka majalah
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Arsip + pencarian ---------- */
function Arsip({ daftar }) {
  const [kata, setKata] = useState('');

  const hasil = useMemo(() => {
    const k = kata.trim().toLowerCase();
    if (!k) return daftar;
    return daftar.filter(
      (m) => m.judul.toLowerCase().includes(k) || m.edisi.toLowerCase().includes(k)
    );
  }, [kata, daftar]);

  return (
    <section id="arsip" className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className={`${judulFont} text-4xl font-extrabold tracking-tight sm:text-5xl`}>
            Semua edisi
          </h2>
          <p className="mt-3 text-[#1E1B4B]/60">
            {daftar.length} majalah tersedia. Pilih satu untuk mulai membaca.
          </p>
        </div>
        <input
          type="search"
          value={kata}
          onChange={(e) => setKata(e.target.value)}
          placeholder="Cari judul atau bulan"
          aria-label="Cari majalah"
          className="w-full rounded-full border-0 bg-white px-6 py-3 text-sm ring-1 ring-[#1E1B4B]/15 placeholder:text-[#1E1B4B]/40 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] sm:w-72"
        />
      </div>

      {hasil.length === 0 ? (
        <p className="mt-16 text-center text-[#1E1B4B]/60">
          Tidak ada majalah yang cocok. Coba kata kunci lain.
        </p>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
          {hasil.map((m) => (
            <Link key={m.id} to={`/majalah/${m.id}`} className="group block focus-visible:outline-none">
              <div className="transition-transform duration-300 group-hover:-translate-y-2 group-focus-visible:-translate-y-2">
                <Sampul majalah={m} />
              </div>
              <h3 className={`${judulFont} mt-5 text-lg font-bold leading-snug group-hover:text-[#FF5A5F]`}>
                {m.judul}
              </h3>
              <p className="mt-1 text-sm text-[#1E1B4B]/60">{m.edisi}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Cara membaca ---------- */
function CaraBaca() {
  const langkah = [
    { judul: 'Pilih majalah', isi: 'Klik sampul edisi yang ingin kamu baca dari daftar arsip.' },
    { judul: 'Buka bukunya', isi: 'Majalah terbuka dalam tampilan buku. Tekan layar penuh agar lebih nyaman.' },
    { judul: 'Balik halaman', isi: 'Geser sudut halaman, klik tombol panah, atau gunakan slider di bawah buku.' },
  ];

  return (
    <section id="cara-baca" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h2 className={`${judulFont} max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl`}>
          Membaca semudah membuka buku.
        </h2>

        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {langkah.map((l, i) => (
            <li key={l.judul} className="flex gap-5">
              <span
                className={`${judulFont} flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFC531] text-xl font-extrabold`}
              >
                {i + 1}
              </span>
              <div>
                <h3 className={`${judulFont} text-xl font-bold`}>{l.judul}</h3>
                <p className="mt-2 leading-relaxed text-[#1E1B4B]/65">{l.isi}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="bg-[#16143A] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`${judulFont} text-xl font-extrabold`}>Majalah Sekolah</p>
          <p className="mt-1 text-sm text-white/55">Ditulis dan dirancang oleh siswa.</p>
        </div>
        <nav className="flex gap-6 text-sm text-white/70">
          <a href="#terbaru" className="hover:text-white">Edisi terbaru</a>
          <a href="#arsip" className="hover:text-white">Arsip</a>
          <a href="#cara-baca" className="hover:text-white">Cara membaca</a>
        </nav>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} Majalah Sekolah
      </div>
    </footer>
  );
}

/* ---------- Halaman Home ---------- */
function Home() {
  return (
    <div className="min-h-screen bg-[#F3F2FB] font-['DM_Sans'] text-[#1E1B4B]">
      <Navbar />
      <Hero daftar={daftarMajalah} />
      <Keunggulan />
      <EdisiTerbaru majalah={daftarMajalah[0]} />
      <Arsip daftar={daftarMajalah} />
      <CaraBaca />
      <Footer />
    </div>
  );
}

export default Home;