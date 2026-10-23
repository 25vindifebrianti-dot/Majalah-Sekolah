import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { daftarMajalah } from '../data/majalah';

// Ganti sesuai rasio gambar halamanmu (tinggi / lebar). Contoh: 1.4 = 5:7
const RASIO = 1.4;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_LANGKAH = 0.5;

// Buku SELALU 2 halaman (laptop maupun HP)
function hitungUkuran() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const mobile = w < 768;

  const tinggiTersedia = h - (mobile ? 200 : 190);
  const lebarTersedia = mobile ? w - 16 : w - 120;

  const lebarDariTinggi = tinggiTersedia / RASIO;
  const lebarDariLayar = lebarTersedia / 2;
  const width = Math.floor(Math.max(120, Math.min(lebarDariTinggi, lebarDariLayar)));

  return { width, height: Math.floor(width * RASIO), mobile };
}

function FlipbookPage() {
  const { id } = useParams();
  const majalah = daftarMajalah.find((m) => m.id === id);
  const bookRef = useRef(null);

  const [ukuran, setUkuran] = useState(hitungUkuran);
  const [halamanAktif, setHalamanAktif] = useState(0);
  const [layarPenuh, setLayarPenuh] = useState(false);

  // Zoom & geser
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [menggeser, setMenggeser] = useState(false);
  const titikAwal = useRef({ x: 0, y: 0 });

  const total = majalah ? majalah.halaman.length : 0;

  useEffect(() => {
    const onResize = () => setUkuran(hitungUkuran());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const batasiPan = useCallback(
    (p, z) => {
      const mx = (ukuran.width * 2 * (z - 1)) / 2 + 40;
      const my = (ukuran.height * (z - 1)) / 2 + 40;
      return {
        x: Math.max(-mx, Math.min(mx, p.x)),
        y: Math.max(-my, Math.min(my, p.y)),
      };
    },
    [ukuran.width, ukuran.height]
  );

  const ubahZoom = useCallback(
    (nilai) => {
      const z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nilai));
      setZoom(z);
      if (z === 1) setPan({ x: 0, y: 0 });
      else setPan((p) => batasiPan(p, z));
    },
    [batasiPan]
  );

  const sebelumnya = useCallback(() => bookRef.current?.pageFlip().flipPrev(), []);
  const berikutnya = useCallback(() => bookRef.current?.pageFlip().flipNext(), []);

  // Keyboard: panah = balik halaman, + / - / 0 = zoom
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') sebelumnya();
      if (e.key === 'ArrowRight') berikutnya();
      if (e.key === '+' || e.key === '=') ubahZoom(zoom + ZOOM_LANGKAH);
      if (e.key === '-') ubahZoom(zoom - ZOOM_LANGKAH);
      if (e.key === '0') ubahZoom(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sebelumnya, berikutnya, ubahZoom, zoom]);

  useEffect(() => {
    const onChange = () => setLayarPenuh(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleLayarPenuh = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  // Scroll mouse di area buku = zoom
  const onWheel = (e) => {
    ubahZoom(zoom + (e.deltaY < 0 ? 0.25 : -0.25));
  };

  // Geser buku saat di-zoom (mouse & sentuhan)
  const mulaiGeser = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    titikAwal.current = { x: e.clientX, y: e.clientY };
    setMenggeser(true);
  };
  const gerakGeser = (e) => {
    if (!menggeser) return;
    const dx = e.clientX - titikAwal.current.x;
    const dy = e.clientY - titikAwal.current.y;
    titikAwal.current = { x: e.clientX, y: e.clientY };
    setPan((p) => batasiPan({ x: p.x + dx, y: p.y + dy }, zoom));
  };
  const selesaiGeser = () => setMenggeser(false);

  if (!majalah) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#16143A] font-['DM_Sans'] text-white">
        <p>
          Majalah tidak ditemukan.{' '}
          <Link to="/" className="text-[#FFC531] underline">
            Kembali ke beranda
          </Link>
        </p>
      </div>
    );
  }

  const tombol =
    'flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC531]';

  const nomorHalaman =
    halamanAktif === 0
      ? 'Sampul'
      : `Halaman ${halamanAktif + 1}${
          halamanAktif + 1 < total ? `–${halamanAktif + 2}` : ''
        } dari ${total}`;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[radial-gradient(ellipse_at_center,#2A2766_0%,#16143A_70%)] font-['DM_Sans'] text-white">
      {/* Bar atas */}
      <header className="relative z-30 flex items-center justify-between gap-3 px-3 py-3 sm:px-8 sm:py-4">
        <Link
          to="/"
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC531]"
        >
          &larr; <span className="hidden sm:inline">Beranda</span>
        </Link>
        <div className="min-w-0 text-center">
          <h1 className="truncate font-['Bricolage_Grotesque'] text-base font-bold sm:text-xl">
            {majalah.judul}
          </h1>
          <p className="text-xs text-white/60">{majalah.edisi}</p>
        </div>
        <button
          onClick={toggleLayarPenuh}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC531]"
        >
          {layarPenuh ? 'Keluar' : 'Layar penuh'}
        </button>
      </header>

      {/* Panggung buku */}
      <main
        onWheel={onWheel}
        className="relative flex flex-1 items-center justify-center overflow-hidden"
      >
        <div
          className="relative"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: menggeser ? 'none' : 'transform 200ms ease-out',
          }}
        >
          {/* bayangan di lantai */}
          <div className="absolute -bottom-6 left-1/2 h-8 w-[90%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl" />

          <HTMLFlipBook
            key={`${ukuran.width}x${ukuran.height}`}
            ref={bookRef}
            width={ukuran.width}
            height={ukuran.height}
            size="fixed"
            showCover={true}
            usePortrait={false}
            startPage={halamanAktif}
            drawShadow={true}
            maxShadowOpacity={0.45}
            flippingTime={900}
            swipeDistance={30}
            useMouseEvents={true}
            mobileScrollSupport={false}
            showPageCorners={true}
            onFlip={(e) => setHalamanAktif(e.data)}
            className="shadow-2xl"
          >
            {majalah.halaman.map((gambar, index) => {
              const keras = index === 0 || index === total - 1;
              return (
                <div
                  key={index}
                  data-density={keras ? 'hard' : 'soft'}
                  className="relative overflow-hidden bg-[#EDEBF7]"
                >
                  <img
                    src={gambar}
                    alt={`Halaman ${index + 1}`}
                    draggable={false}
                    decoding="async"
                    className="pointer-events-none block h-full w-full select-none object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.insertAdjacentHTML(
                        'beforeend',
                        `<div class="flex h-full w-full items-center justify-center text-sm font-bold text-[#1E1B4B]/40">Halaman ${index + 1}</div>`
                      );
                    }}
                  />
                  {/* bayangan lipatan di tengah buku */}
                  {index > 0 && (
                    <div
                      className={`pointer-events-none absolute inset-y-0 w-10 ${
                        index % 2 === 0
                          ? 'right-0 bg-gradient-to-l'
                          : 'left-0 bg-gradient-to-r'
                      } from-black/25 to-transparent`}
                    />
                  )}
                </div>
              );
            })}
          </HTMLFlipBook>
        </div>

        {/* Saat di-zoom: lapisan ini menangkap sentuhan/drag untuk menggeser buku */}
        {zoom > 1 && (
          <div
            onPointerDown={mulaiGeser}
            onPointerMove={gerakGeser}
            onPointerUp={selesaiGeser}
            onPointerCancel={selesaiGeser}
            className={`absolute inset-0 z-20 ${menggeser ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ touchAction: 'none' }}
            aria-label="Geser untuk melihat bagian lain halaman"
          />
        )}
      </main>

      {/* Kontrol bawah */}
      <footer className="relative z-30 flex flex-col items-center gap-3 px-4 pb-5 pt-2">
        <div className="flex w-full max-w-xl items-center gap-3 sm:gap-4">
          <button
            onClick={sebelumnya}
            disabled={halamanAktif === 0}
            aria-label="Halaman sebelumnya"
            className={tombol}
          >
            &#8592;
          </button>

          <input
            type="range"
            min={0}
            max={Math.max(total - 1, 0)}
            value={halamanAktif}
            onChange={(e) => bookRef.current?.pageFlip().flip(Number(e.target.value))}
            aria-label="Pilih halaman"
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-[#FF5A5F]"
          />

          <button
            onClick={berikutnya}
            disabled={halamanAktif >= total - 1}
            aria-label="Halaman berikutnya"
            className={tombol}
          >
            &#8594;
          </button>
        </div>

        <div className="flex w-full max-w-xl items-center justify-between gap-4">
          <p className="text-sm text-white/60">{nomorHalaman}</p>

          {/* Kontrol zoom */}
          <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
            <button
              onClick={() => ubahZoom(zoom - ZOOM_LANGKAH)}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Perkecil"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-white transition hover:bg-white/15 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC531]"
            >
              &minus;
            </button>
            <button
              onClick={() => ubahZoom(1)}
              aria-label="Kembali ke ukuran asli"
              className="min-w-[3.5rem] rounded-full px-2 py-1.5 text-sm font-medium text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC531]"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => ubahZoom(zoom + ZOOM_LANGKAH)}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Perbesar"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-white transition hover:bg-white/15 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC531]"
            >
              +
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FlipbookPage;