// ================================
// SAYULITA TURTLE RELEASE – WORKING PWA
// VERCEL-SAFE, NO EXTERNAL UI LIBRARIES
// ================================
"use client";

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

  /* -------------------- LOAD SAVED DATA -------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sayulita-turtle-nests");
      if (saved) setRecords(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load saved records", err);
    }
  }, []);

  /* -------------------- SAVE OFFLINE -------------------- */
  useEffect(() => {
    localStorage.setItem(
      "sayulita-turtle-nests",
      JSON.stringify(records)
    );
  }, [records]);

  /* -------------------- GPS -------------------- */
  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setGps(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      },
      () => alert("Unable to retrieve GPS location")
    );
  };

  /* -------------------- PHOTO -------------------- */
  const handlePhoto = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPhoto(url);
  };

  /* Clean up photo URL */
  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  /* -------------------- SUBMIT -------------------- */
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

    setRecords(prev => [...prev, record]);

    setForm({
      volunteer: "",
      patrolId: "",
      date: "",
      time: "",
      location: "",
      species: "Olive Ridley",
      eggs: "",
      notes: ""
    });

    setGps("");
    setPhoto(null);
  };

  const t = {
    en: {
      title: "Sayulita Turtle Nest Patrol",
      save: "Save Nest",
      gps: "Capture GPS"
    },
    es: {
      title: "Patrulla de Nidos – Sayulita",
      save: "Guardar Nido",
      gps: "Capturar GPS"
    }
  };

  return (
    <main style={{ maxWidth: 500, margin: "0 auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🐢 {t[lang].title}</h1>
        <button type="button" onClick={() => setLang(lang === "en" ? "es" : "en")}>
          {lang === "en" ? "ES" : "EN"}
        </button>
      </header>

      <input
        placeholder="Volunteer / Voluntario"
        value={form.volunteer}
        onChange={e => setForm({ ...form, volunteer: e.target.value })}
      />

      <input
        placeholder="Patrol ID / Patrulla"
        value={form.patrolId}
        onChange={e => setForm({ ...form, patrolId: e.target.value })}
      />

      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />

      <input
        placeholder="Beach / Playa"
        value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })}
      />

      <button type="button" onClick={captureGPS}>
        📍 {t[lang].gps}
      </button>

      {gps && <p>{gps}</p>}

      <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} />

      {photo && (
        <img
          src={photo}
          alt="Nest photo"
          style={{ width: "100%", marginTop: 8 }}
        />
      )}

      <input value={form.species} readOnly />

      <input
        type="number"
        placeholder="# Eggs"
        value={form.eggs}
        onChange={e => setForm({ ...form, eggs: e.target.value })}
      />

      <textarea
        placeholder="Notes"
        value={form.notes}
        onChange={e => setForm({ ...form, notes: e.target.value })}
      />

      <button type="button" onClick={handleSubmit}>
        {t[lang].save}
      </button>

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
