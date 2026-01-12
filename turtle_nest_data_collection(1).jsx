// ================================
// SAYULITA TURTLE RELEASE – WORKING PWA
// VERCEL-SAFE, NO EXTERNAL UI LIBRARIES
// ================================

import { useState, useEffect } from "react";

export default function Page() {
  const [records, setRecords] = useState([]);
  const [gps, setGps] = useState("");
  const [photo, setPhoto] = useState(null);
  const [lang, setLang] = useState("en");

  const [form, setForm] = useState({
    volunteer: "",
    patrolId: "",
    date: "",
    time: "",
    location: "",
    species: "Olive Ridley",
    eggs: "",
    notes: ""
  });

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("sayulita-turtle-nests");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  // Save data offline
  useEffect(() => {
    localStorage.setItem("sayulita-turtle-nests", JSON.stringify(records));
  }, [records]);

  // GPS capture
  const captureGPS = () => {
    if (!navigator.geolocation) return alert("GPS not supported");
    navigator.geolocation.getCurrentPosition(pos => {
      setGps(`${pos.coords.latitude}, ${pos.coords.longitude}`);
    });
  };

  // Photo capture
  const handlePhoto = e => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  // Save record
  const handleSubmit = () => {
    if (!form.volunteer || !form.location) {
      alert("Volunteer name and location are required");
      return;
    }

    const record = {
      id: `NEST-${Date.now()}`,
      ...form,
      gps,
      photo,
      timestamp: new Date().toISOString()
    };

    setRecords([...records, record]);
    setForm({ volunteer: "", patrolId: "", date: "", time: "", location: "", species: "Olive Ridley", eggs: "", notes: "" });
    setGps("");
    setPhoto(null);

    // OPTIONAL CLOUD SYNC
    // fetch("PASTE_WEBHOOK_URL_HERE", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(record)
    // });
  };

  const t = {
    en: { title: "Sayulita Turtle Nest Patrol", save: "Save Nest", gps: "Capture GPS" },
    es: { title: "Patrulla de Nidos – Sayulita", save: "Guardar Nido", gps: "Capturar GPS" }
  };

  return (
    <main style={{ maxWidth: 500, margin: "0 auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🐢 {t[lang].title}</h1>
        <button onClick={() => setLang(lang === "en" ? "es" : "en")}>{lang === "en" ? "ES" : "EN"}</button>
      </header>

      <input placeholder="Volunteer / Voluntario" value={form.volunteer} onChange={e => setForm({ ...form, volunteer: e.target.value })} />
      <input placeholder="Patrol ID / Patrulla" value={form.patrolId} onChange={e => setForm({ ...form, patrolId: e.target.value })} />
      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
      <input placeholder="Beach / Playa" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />

      <button onClick={captureGPS}>📍 {t[lang].gps}</button>
      {gps && <p>{gps}</p>}

      <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} />
      {photo && <img src={photo} style={{ width: "100%", marginTop: 8 }} />}

      <input value={form.species} readOnly />
      <input type="number" placeholder="# Eggs" value={form.eggs} onChange={e => setForm({ ...form, eggs: e.target.value })} />
      <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

      <button onClick={handleSubmit}>{t[lang].save}</button>

      <hr />
      <h3>Saved Records</h3>
      {records.map(r => (
        <div key={r.id} style={{ fontSize: 12, borderBottom: "1px solid #ccc" }}>
          {r.id} – {r.location}
        </div>
      ))}
    </main>
  );
}

// ================================
// WHY THIS WORKS ON VERCEL
// ================================
// • No shadcn/ui imports
// • No alias paths (@/components)
// • No server-side APIs required
// • Runs as a single client component
// • Fully compatible with Next.js + Vercel

// ================================
// NEXT FILES TO ADD (REQUIRED)
// ================================
// /public/manifest.json
// /public/icon-192.png
// /public/icon-512.png
// /public/service-worker.js
Remove app router
