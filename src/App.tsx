import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownUp, ArrowRight, BookOpen, Check, ChevronDown, CircleHelp, Filter, Heart,
  Leaf, MapPin, Menu, MessageCircle, Plus, Search, SlidersHorizontal, Sparkles, X
} from "lucide-react";

type Distribution = "Hibah" | "Barter" | "Beli murah";
type Availability = "Tersedia" | "Dipesan" | "Selesai";
type Listing = {
  Id: number;
  Title: string;
  Author: string;
  Course: string;
  CourseCode: string;
  Faculty: string;
  Campus: string;
  Semester: string;
  Distribution: Distribution;
  Price: number;
  Condition: number;
  ConditionNote: string;
  MeetingPoint: string;
  Owner: string;
  Whatsapp: string;
  Image: string;
  Availability: Availability;
  Tags: string[];
  IsNew?: boolean;
};

const starterListings: Listing[] = [
  {
    Id: 1, Title: "Algoritma & Pemrograman", Author: "Rinaldi Munir", Course: "Algoritma dan Pemrograman",
    CourseCode: "IF2211", Faculty: "Informatika", Campus: "ITB · Ganesha", Semester: "Semester 2",
    Distribution: "Beli murah", Price: 35000, Condition: 8,
    ConditionNote: "Sampul masih bagus, ada beberapa stabilo di bab 3 dan 5. Isi lengkap.",
    MeetingPoint: "Perpustakaan Pusat ITB", Owner: "Nadia P.", Whatsapp: "6281234567890",
    Image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=720&q=85",
    Availability: "Tersedia", Tags: ["Buku teks", "Edisi 3"]
  },
  {
    Id: 2, Title: "Diktat Kalkulus II", Author: "Tim Dosen Matematika", Course: "Kalkulus II",
    CourseCode: "MA2121", Faculty: "Matematika", Campus: "ITB · Ganesha", Semester: "Semester 2",
    Distribution: "Hibah", Price: 0, Condition: 7,
    ConditionNote: "Diktat cetak dosen, jilid masih utuh. Ada coretan pensil tipis di beberapa halaman.",
    MeetingPoint: "Kantin CC Barat", Owner: "Dimas R.", Whatsapp: "6289876543210",
    Image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=720&q=85",
    Availability: "Tersedia", Tags: ["Diktat lokal", "Non-ISBN"]
  },
  {
    Id: 3, Title: "Kimia Organik Dasar", Author: "Fessenden & Fessenden", Course: "Kimia Organik",
    CourseCode: "KI201", Faculty: "Kimia", Campus: "Universitas Padjadjaran", Semester: "Semester 3",
    Distribution: "Barter", Price: 0, Condition: 9,
    ConditionNote: "Kondisi sangat baik, tanpa coretan. Bersedia tukar dengan buku Biokimia.",
    MeetingPoint: "Lobi Fakultas MIPA", Owner: "Alya S.", Whatsapp: "6281122334455",
    Image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=720&q=85",
    Availability: "Tersedia", Tags: ["Buku teks", "Barter fleksibel"]
  },
  {
    Id: 4, Title: "Modul Praktikum Basis Data", Author: "Laboratorium Informatika", Course: "Basis Data",
    CourseCode: "IF2240", Faculty: "Informatika", Campus: "ITB · Ganesha", Semester: "Semester 4",
    Distribution: "Beli murah", Price: 12000, Condition: 6,
    ConditionNote: "Modul fotokopi, beberapa halaman diberi tanda stabilo. Tidak ada halaman hilang.",
    MeetingPoint: "Selasar Labtek V", Owner: "Bagas W.", Whatsapp: "6281355577788",
    Image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=720&q=85",
    Availability: "Tersedia", Tags: ["Modul praktikum", "Non-ISBN"]
  },
  {
    Id: 5, Title: "Pengantar Ekonomi Mikro", Author: "Sadono Sukirno", Course: "Ekonomi Mikro",
    CourseCode: "EKO110", Faculty: "Ekonomi dan Bisnis", Campus: "Universitas Padjadjaran", Semester: "Semester 1",
    Distribution: "Beli murah", Price: 28000, Condition: 8,
    ConditionNote: "Sampul ada sedikit bekas pemakaian, halaman bersih dan lengkap.",
    MeetingPoint: "Perpustakaan Unpad Jatinangor", Owner: "Rafi A.", Whatsapp: "6282233344455",
    Image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=720&q=85",
    Availability: "Dipesan", Tags: ["Buku teks", "Edisi 4"]
  },
  {
    Id: 6, Title: "Fisika Dasar: Mekanika", Author: "Halliday, Resnick, Walker", Course: "Fisika Dasar I",
    CourseCode: "FI1101", Faculty: "Fisika", Campus: "ITB · Ganesha", Semester: "Semester 1",
    Distribution: "Hibah", Price: 0, Condition: 7,
    ConditionNote: "Edisi lama tapi materi masih relevan. Catatan kuliah ada di halaman belakang.",
    MeetingPoint: "Taman GKU Timur", Owner: "Sinta M.", Whatsapp: "6281555667788",
    Image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=720&q=85",
    Availability: "Tersedia", Tags: ["Buku teks", "Edisi 5"]
  }
];

const modes: Array<{ Name: "Semua" | Distribution; Color: string }> = [
  { Name: "Semua", Color: "all" }, { Name: "Hibah", Color: "give" },
  { Name: "Barter", Color: "swap" }, { Name: "Beli murah", Color: "buy" }
];
const faculties = ["Semua jurusan", "Informatika", "Matematika", "Kimia", "Fisika", "Ekonomi dan Bisnis"];
const campuses = ["Semua kampus", "ITB · Ganesha", "Universitas Padjadjaran"];
const formatPrice = (price: number) => price === 0 ? "Gratis" : `Rp${price.toLocaleString("id-ID")}`;

function loadListings(): Listing[] {
  try {
    const stored = localStorage.getItem("operbuku-listings");
    return stored ? [...JSON.parse(stored) as Listing[], ...starterListings] : starterListings;
  } catch { return starterListings; }
}

function App() {
  const [listings, setListings] = useState<Listing[]>(loadListings);
  const [mode, setMode] = useState("Semua");
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("Semua jurusan");
  const [campus, setCampus] = useState("Semua kampus");
  const [semester, setSemester] = useState("Semua semester");
  const [sort, setSort] = useState("Terbaru");
  const [liked, setLiked] = useState<number[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [showListing, setShowListing] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = listings.filter((item) => {
      const matchesSearch = !term || [item.Title, item.Author, item.Course, item.CourseCode, item.Tags.join(" ")]
        .some((value) => value.toLowerCase().includes(term));
      return matchesSearch && (mode === "Semua" || item.Distribution === mode)
        && (faculty === "Semua jurusan" || item.Faculty === faculty)
        && (campus === "Semua kampus" || item.Campus === campus)
        && (semester === "Semua semester" || item.Semester === semester);
    });
    return result.sort((first, second) => sort === "Harga terendah"
      ? (first.Price || 0) - (second.Price || 0)
      : second.Id - first.Id);
  }, [listings, mode, search, faculty, campus, semester, sort]);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function toggleLike(id: number) {
    setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function submitListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const listing: Listing = {
      Id: Date.now(), Title: String(form.get("Title")), Author: String(form.get("Author")),
      Course: String(form.get("Course")), CourseCode: String(form.get("CourseCode")),
      Faculty: String(form.get("Faculty")), Campus: String(form.get("Campus")),
      Semester: String(form.get("Semester")), Distribution: form.get("Distribution") as Distribution,
      Price: Number(form.get("Price") || 0), Condition: Number(form.get("Condition")),
      ConditionNote: String(form.get("ConditionNote")), MeetingPoint: String(form.get("MeetingPoint")),
      Owner: String(form.get("Owner")), Whatsapp: String(form.get("Whatsapp")),
      Image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=720&q=85",
      Availability: "Tersedia", Tags: ["Baru ditambahkan"], IsNew: true
    };
    const next = [listing, ...listings];
    setListings(next);
    localStorage.setItem("operbuku-listings", JSON.stringify(next.filter((item) => item.IsNew)));
    setShowListing(false);
    setMode("Semua"); setSearch(""); setFaculty("Semua jurusan"); setCampus("Semua kampus");
    setSemester("Semua semester");
    flash("Bahan ajar berhasil ditambahkan ke katalog.");
  }

  const waMessage = (item: Listing) => encodeURIComponent(
    `Halo ${item.Owner}, saya tertarik dengan "${item.Title}" (${item.CourseCode}) di OperBuku. Apakah masih tersedia?`
  );

  return <div className="app-frame">
    <div className="announcement"><Leaf size={14} /><span>Bahan ajar berputar, manfaat berlanjut.</span>
      <span className="announcement-separator">·</span><span>Mulai dari kampusmu</span></div>
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="OperBuku beranda"><span className="wordmark-icon"><BookOpen size={19} /></span>
        <span>oper<span>buku</span></span><i>.</i></a>
      <nav className="primary-nav"><a className="nav-active" href="#katalog">Jelajahi</a><a href="#cara-kerja">Cara kerja</a>
        <button className="nav-link" onClick={() => flash("Daftar simpanan kamu masih kosong.")}>
          Simpanan{liked.length > 0 && <span className="saved-count">{liked.length}</span>}</button></nav>
      <div className="header-actions"><button className="sell-button" onClick={() => setShowListing(true)}><Plus size={16} />Titipkan buku</button>
        <button className="mobile-menu" onClick={() => setMobileFilters(!mobileFilters)} aria-label="Buka filter"><Menu size={20} /></button>
        <span className="user-avatar" title="Profil mahasiswa">N</span></div>
    </header>

    <main id="home">
      <section className="intro-band">
        <div className="intro-copy"><div className="intro-kicker"><span /> RUANG BERTUKAR BAHAN AJAR KAMPUS</div>
          <h1>Ilmu jangan<br /><em>berhenti di rak.</em></h1>
          <p>Buku, diktat, dan modul dari kakak tingkatmu. Temukan yang kamu butuhkan, teruskan yang sudah selesai.</p>
          <a href="#katalog" className="intro-link">Jelajahi bahan ajar <ArrowRight size={16} /></a>
          <div className="community-note"><span className="avatar-stack"><i>R</i><i>A</i><i>D</i><i>+</i></span>
            <span>Berbagi ilmu, mulai dari teman kampus</span></div>
        </div>
        <div className="intro-art" aria-label="Tumpukan buku bekas yang siap digunakan kembali">
          <div className="art-sticker sticker-top"><Leaf size={13} /> PUTAR LAGI</div>
          <div className="book-stack"><div className="book book-one"><span>CATATAN<br />PERKULIAHAN</span><i>02</i></div>
            <div className="book book-two"><span>IDE YANG<br />TERUS TUMBUH</span><i>01</i></div>
            <div className="book book-three"><BookOpen size={21} /><span>RUANG KECIL<br />UNTUK ILMU</span></div>
            <span className="book-leaf leaf-one" /><span className="book-leaf leaf-two" /></div>
          <div className="art-caption"><span>01 / SIKLUS BARU</span><span>SETIAP BUKU PUNYA CERITA LANJUTAN</span></div>
        </div>
        <div className="intro-index">OB—01</div>
      </section>

      <section className="impact-strip" id="cara-kerja"><div><span className="impact-icon"><ArrowDownUp size={17} /></span>
        <span><strong>Hibah, barter, atau beli</strong><small>Pilih cara yang paling pas</small></span></div>
        <span className="impact-divider" /><div><span className="impact-icon"><MapPin size={17} /></span>
        <span><strong>Ketemu di kampus</strong><small>Tanpa ongkir, tanpa ribet</small></span></div>
        <span className="impact-divider" /><div><span className="impact-icon"><Leaf size={17} /></span>
        <span><strong>Pakai lebih lama</strong><small>Kurangi tumpukan dan limbah</small></span></div>
        <a className="impact-about" href="#katalog">Lihat katalog <ArrowRight size={15} /></a>
      </section>

      <section className="catalog-section" id="katalog">
        <div className="catalog-title-row"><div><div className="section-eyebrow"><Sparkles size={13} /> DARI KAMPUS, UNTUK KAMPUS</div>
            <h2>Temukan bahan ajarmu<span>.</span></h2><p>Barang nyata dari mahasiswa. Kondisi dijelaskan apa adanya.</p></div>
          <div className="catalog-total"><strong>{filtered.length.toString().padStart(2, "0")}</strong><span>BAHAN AJAR<br />TERSEDIA</span></div></div>
        <div className={`catalog-tools ${mobileFilters ? "mobile-open" : ""}`}>
          <label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari judul, mata kuliah, atau kode..." /><kbd>⌘ K</kbd></label>
          <span className="tool-divider" />
          <label className="select-field"><span>KAMPUS</span><select value={campus} onChange={(event) => setCampus(event.target.value)}>
            {campuses.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
          <label className="select-field"><span>JURUSAN</span><select value={faculty} onChange={(event) => setFaculty(event.target.value)}>
            {faculties.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
          <label className="select-field semester-select"><span>SEMESTER</span><select value={semester} onChange={(event) => setSemester(event.target.value)}>
            {["Semua semester", "Semester 1", "Semester 2", "Semester 3", "Semester 4"].map((item) => <option key={item}>{item}</option>)}
          </select><ChevronDown size={14} /></label>
          <button className="filter-button" onClick={() => setMobileFilters(!mobileFilters)} title="Tampilkan filter">
            <SlidersHorizontal size={16} /><Filter size={12} /></button>
        </div>
        <div className="catalog-subnav"><div className="mode-tabs" role="tablist" aria-label="Filter skema perolehan">
          {modes.map((item) => <button key={item.Name} role="tab" aria-selected={mode === item.Name}
            className={`mode-tab ${mode === item.Name ? "selected" : ""}`} onClick={() => setMode(item.Name)}>
            <i className={`mode-dot ${item.Color}`} />{item.Name}</button>)}</div>
          <label className="sort-field"><ArrowDownUp size={14} /><select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>Terbaru</option><option>Harga terendah</option></select><ChevronDown size={13} /></label>
        </div>
        <div className="results-caption"><span>MENAMPILKAN <strong>{filtered.length}</strong> BAHAN AJAR</span>
          <span className="result-condition"><i /> PEMILIK TERHUBUNG LANGSUNG</span></div>
        {filtered.length > 0 ? <div className="book-grid">{filtered.map((item, index) => <BookCard key={item.Id} Item={item}
          Index={index} Liked={liked.includes(item.Id)} ToggleLike={() => toggleLike(item.Id)} Open={() => setSelected(item)} />)}</div>
          : <div className="no-results"><span><Search size={22} /></span><h3>Belum ada yang cocok</h3>
            <p>Coba kata pencarian atau filter yang berbeda.</p><button onClick={() => {
              setMode("Semua"); setSearch(""); setFaculty("Semua jurusan"); setCampus("Semua kampus"); setSemester("Semua semester");
            }}>Hapus semua filter</button></div>}
        <button className="load-more" onClick={() => flash("Kamu sudah melihat semua bahan ajar yang tersedia.")}>
          Sudah lihat semuanya <Check size={15} /></button>
      </section>
      <section className="closing-note"><div><span className="closing-icon"><CircleHelp size={18} /></span>
        <span><strong>Punya modul yang sudah selesai dipakai?</strong><small>Teruskan ke teman yang membutuhkan. Diktat non-ISBN juga diterima.</small></span></div>
        <button onClick={() => setShowListing(true)}>Bagikan bahan ajar <ArrowRight size={15} /></button></section>
    </main>

    <footer className="site-footer"><a className="wordmark footer-mark" href="#home"><span className="wordmark-icon"><BookOpen size={17} /></span>
      <span>oper<span>buku</span></span><i>.</i></a><span>Pengetahuan baik saat diteruskan.</span>
      <span>BUAT KAMPUS LEBIH SIRKULAR <Leaf size={12} /></span></footer>

    {selected && <DetailModal Item={selected} Close={() => setSelected(null)} Message={waMessage(selected)} />}
    {showListing && <ListingModal Close={() => setShowListing(false)} Submit={submitListing} />}
    {toast && <div className="toast"><Check size={17} />{toast}<button onClick={() => setToast("")} aria-label="Tutup"><X size={15} /></button></div>}
  </div>;
}

function BookCard({ Item, Index, Liked, ToggleLike, Open }: {
  Item: Listing; Index: number; Liked: boolean; ToggleLike: () => void; Open: () => void;
}) {
  const modeClass = Item.Distribution === "Hibah" ? "give" : Item.Distribution === "Barter" ? "swap" : "buy";
  return <article className="book-card" style={{ animationDelay: `${Index * 55}ms` }}>
    <button className="book-photo" onClick={Open} aria-label={`Lihat detail ${Item.Title}`}>
      <img src={Item.Image} alt={`Foto ${Item.Title}`} loading="lazy" />
      <span className={`offer-pill ${modeClass}`}>{Item.Distribution === "Beli murah" ? "BELI MURAH" : Item.Distribution.toUpperCase()}</span>
      <span className={`availability ${Item.Availability === "Tersedia" ? "available" : "reserved"}`}>
        <i />{Item.Availability.toUpperCase()}</span>
      {Item.IsNew && <span className="new-pill">BARU</span>}
    </button>
    <button className={`favorite-button ${Liked ? "liked" : ""}`} onClick={ToggleLike} aria-label={Liked ? "Hapus dari simpanan" : "Simpan bahan ajar"}>
      <Heart size={16} fill={Liked ? "currentColor" : "none"} /></button>
    <div className="book-info" onClick={Open} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && Open()}>
      <div className="book-course"><span>{Item.CourseCode}</span><i>·</i><span>{Item.Faculty}</span></div>
      <h3>{Item.Title}</h3><p className="book-author">{Item.Author}</p>
      <div className="book-card-bottom"><span className={`book-price ${Item.Distribution === "Hibah" ? "free-price" : ""}`}>
        {formatPrice(Item.Price)}</span><span className="book-condition">Kondisi <strong>{Item.Condition}/10</strong></span></div>
      <div className="book-card-location"><MapPin size={13} />{Item.Campus}<span>·</span>{Item.MeetingPoint}</div>
    </div>
    <button className="quick-contact" onClick={Open}><MessageCircle size={14} />Lihat detail & hubungi</button>
  </article>;
}

function DetailModal({ Item, Close, Message }: { Item: Listing; Close: () => void; Message: string }) {
  return <div className="modal-scrim" onMouseDown={(event) => event.target === event.currentTarget && Close()}>
    <section className="detail-modal" role="dialog" aria-modal="true" aria-label={`Detail ${Item.Title}`}>
      <button className="modal-close" onClick={Close} aria-label="Tutup"><X size={19} /></button>
      <div className="detail-image"><img src={Item.Image} alt={`Foto ${Item.Title}`} />
        <span className={`offer-pill ${Item.Distribution === "Hibah" ? "give" : Item.Distribution === "Barter" ? "swap" : "buy"}`}>
          {Item.Distribution === "Beli murah" ? "BELI MURAH" : Item.Distribution.toUpperCase()}</span></div>
      <div className="detail-copy"><div className="detail-course">{Item.CourseCode} <i>·</i> {Item.Course} <i>·</i> {Item.Semester}</div>
        <h2>{Item.Title}</h2><p className="detail-author">oleh {Item.Author}</p>
        <div className="detail-price-line"><strong className={Item.Distribution === "Hibah" ? "free-price" : ""}>{formatPrice(Item.Price)}</strong>
          <span className="condition-score">KONDISI <b>{Item.Condition}/10</b></span></div>
        <div className="condition-box"><div className="condition-head"><span>KONDISI FISIK</span><div className="condition-scale" aria-label={`Kondisi ${Item.Condition} dari 10`}>
          {Array.from({ length: 10 }, (_, index) => <i className={index < Item.Condition ? "filled" : ""} key={index} />)}</div></div>
          <p>{Item.ConditionNote}</p></div>
        {Item.Distribution === "Barter" && <div className="barter-note"><ArrowDownUp size={15} /> Pemilik terbuka untuk barter bahan ajar setara.</div>}
        <div className="meeting-card"><span className="meeting-pin"><MapPin size={17} /></span><span><small>TITIK TEMU COD</small><strong>{Item.MeetingPoint}</strong><i>{Item.Campus}</i></span></div>
        <div className="owner-line"><span className="owner-avatar">{Item.Owner.charAt(0)}</span><span><small>DITAWARKAN OLEH</small><strong>{Item.Owner}</strong></span>
          <span className="owner-verified"><Check size={12} />Mahasiswa</span></div>
        {Item.Availability === "Tersedia" ? <a className="whatsapp-button" href={`https://wa.me/${Item.Whatsapp}?text=${Message}`} target="_blank" rel="noreferrer">
          <MessageCircle size={17} />Tanya pemilik via WhatsApp <ArrowRight size={16} /></a>
          : <button className="whatsapp-button unavailable" disabled><Check size={16} />Bahan ajar sedang dipesan</button>}
        <p className="direct-note">Transaksi langsung antar mahasiswa. Tidak ada biaya admin.</p>
      </div>
    </section>
  </div>;
}

function ListingModal({ Close, Submit }: { Close: () => void; Submit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-scrim" onMouseDown={(event) => event.target === event.currentTarget && Close()}>
    <section className="listing-modal" role="dialog" aria-modal="true" aria-labelledby="listing-title">
      <div className="listing-modal-head"><div><span className="section-eyebrow"><Leaf size={13} /> TERUSKAN MANFAAT</span>
        <h2 id="listing-title">Titipkan bahan ajar<span>.</span></h2></div>
        <button className="modal-close" onClick={Close} aria-label="Tutup"><X size={19} /></button></div>
      <form className="listing-form" onSubmit={Submit}>
        <div className="form-section-label">TENTANG BAHAN AJAR</div>
        <div className="form-grid"><label>Judul bahan ajar<input name="Title" required placeholder="Contoh: Diktat Kalkulus II" /></label>
          <label>Penulis<input name="Author" required placeholder="Nama penulis / dosen" /></label>
          <label>Mata kuliah<input name="Course" required placeholder="Contoh: Kalkulus II" /></label>
          <label>Kode mata kuliah<input name="CourseCode" required placeholder="Contoh: MA2121" /></label>
          <label>Fakultas / jurusan<select name="Faculty" defaultValue="Informatika">{faculties.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Kampus<select name="Campus" defaultValue="ITB · Ganesha">{campuses.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Semester sasaran<select name="Semester" defaultValue="Semester 1">{[1, 2, 3, 4, 5, 6, 7, 8].map((item) =>
            <option key={item}>Semester {item}</option>)}</select></label>
          <label>Skema<select name="Distribution"><option>Hibah</option><option>Barter</option><option>Beli murah</option></select></label>
          <label>Harga (Rp)<input name="Price" type="number" min="0" defaultValue="0" /></label>
          <label>Kondisi fisik (1–10)<input name="Condition" type="number" min="1" max="10" defaultValue="8" required /></label>
          <label className="form-wide">Catatan kondisi<input name="ConditionNote" required placeholder="Ceritakan kondisi, coretan, atau halaman yang kurang" /></label>
          <label>Titik temu COD<input name="MeetingPoint" required placeholder="Contoh: Perpustakaan pusat" /></label>
          <label>Nama panggilan<input name="Owner" required placeholder="Contoh: Nadia P." /></label>
          <label className="form-wide">Nomor WhatsApp<input name="Whatsapp" type="tel" required placeholder="62812... (gunakan kode negara)" /></label>
        </div>
        <div className="form-footnote"><MapPin size={14} />Serah terima langsung di area kampus, tanpa ongkos kirim.</div>
        <div className="form-actions"><button type="button" className="cancel-button" onClick={Close}>Batal</button>
          <button type="submit" className="submit-listing"><Plus size={16} />Terbitkan di katalog</button></div>
      </form>
    </section>
  </div>;
}

export default App;