"use client";

import { useMemo, useState } from "react";
import { services } from "@/lib/services";

type FormState = { name: string; phone: string; email: string; service: string; date: string; time: string; notes: string };

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [quiz, setQuiz] = useState("glow");
  const [booking, setBooking] = useState<FormState>({
    name: "", phone: "", email: "", service: "", date: "", time: "", notes: ""
  });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const total = useMemo(() => services.filter(s => selected.includes(s.id)).reduce((sum, s) => sum + s.price, 0), [selected]);
  const recommended = quiz === "relax" ? ["moroccan", "facial"] : quiz === "details" ? ["nails", "lashes"] : ["facial", "hair"];

  function toggleService(id: string) {
    setSelected(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit booking.");
      setStatus("Your appointment request has been received. We will contact you to confirm it.");
      setBooking({ name: "", phone: "", email: "", service: "", date: "", time: "", notes: "" });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }

  async function submitPackage() {
    if (!selected.length) { setStatus("Choose at least one service to build your package."); return; }
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/packages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceIds: selected })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save package.");
      setStatus("Your package has been saved. You can now book your selected services.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Package preview is ready. Add Supabase settings to save it.");
    } finally { setBusy(false); }
  }

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#home"><span className="brand-mark">D</span><span>DALIA<small>BEAUTY CENTER</small></span></a>
        <nav><a href="#services">Services</a><a href="#quiz">Beauty Quiz</a><a href="#package">Build a Package</a><a href="#gallery">Gallery</a></nav>
        <a className="nav-cta" href="#booking">Book Now ↗</a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">A LITTLE TIME FOR YOURSELF</p>
          <h1>Your beauty.<br/><em>Your moment.</em></h1>
          <p className="hero-text">Thoughtful beauty care, relaxing experiences and a little luxury in every detail.</p>
          <div className="hero-actions"><a className="button primary" href="#booking">Book your appointment</a><a className="text-link" href="#services">Explore services →</a></div>
          <div className="hero-note"><span>✦</span> LUXURY CARE · CAIRO</div>
        </div>
        <div className="hero-art">
          <div className="hero-photo"><div className="photo-orb">D</div><div className="photo-caption">Feel beautiful<br/>inside & out.</div></div>
          <div className="floating-seal">LUXURY<br/>CARE <b>✧</b></div>
        </div>
      </section>

      <section className="intro section">
        <p className="eyebrow">WELCOME TO DALIA</p><h2>Beauty care, made <em>personal.</em></h2>
        <p>From the little details to your full self-care day, discover services designed to help you feel refreshed, confident and cared for.</p>
      </section>

      <section className="section services-section" id="services">
        <div className="section-head"><div><p className="eyebrow">OUR SERVICES</p><h2>Find your <em>feel-good.</em></h2></div><p>Choose the care you need today.<br/>We’ll take care of the details.</p></div>
        <div className="service-grid">
          {services.map((s, i) => <article className="service-card" key={s.id}>
            <div className={`service-art art-${i+1}`}><span>{["✧","❋","♡","✿","☼","◌"][i]}</span></div>
            <div className="service-info"><div><h3>{s.name}</h3><p>{s.description}</p></div><strong>From EGP {s.price}</strong></div>
          </article>)}
        </div>
      </section>

      <section className="quiz-section section" id="quiz">
        <div className="quiz-copy"><p className="eyebrow">YOUR PERSONAL BEAUTY GUIDE</p><h2>Not sure where<br/>to <em>start?</em></h2><p>Tell us what kind of moment you need. We’ll suggest a few services to explore.</p></div>
        <div className="quiz-panel">
          <p className="step">A QUICK BEAUTY CHECK-IN</p><h3>What are you in the mood for?</h3>
          <div className="quiz-options">
            <button className={quiz === "glow" ? "choice active" : "choice"} onClick={() => setQuiz("glow")}>A fresh glow <span>✧</span></button>
            <button className={quiz === "details" ? "choice active" : "choice"} onClick={() => setQuiz("details")}>A polished look <span>♡</span></button>
            <button className={quiz === "relax" ? "choice active" : "choice"} onClick={() => setQuiz("relax")}>A moment to relax <span>☼</span></button>
          </div>
          <div className="recommendation"><small>YOUR SUGGESTED START</small><p>{services.filter(s => recommended.includes(s.id)).map(s => s.name).join(" + ")}</p><a href="#booking" onClick={() => setBooking(b => ({...b, service: recommended[0]}))}>Book a service →</a></div>
        </div>
      </section>

      <section className="section package-section" id="package">
        <div className="section-head"><div><p className="eyebrow">MADE FOR YOU</p><h2>Build your beauty <em>package.</em></h2></div><p>Mix your favourite services<br/>and create your own self-care plan.</p></div>
        <div className="package-layout">
          <div className="package-list">{services.map(s => <label className="package-item" key={s.id}>
            <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleService(s.id)}/>
            <span className="checkmark"></span><span className="package-name">{s.name}<small>{s.description}</small></span><b>EGP {s.price}</b>
          </label>)}</div>
          <aside className="package-summary"><p className="eyebrow">YOUR PACKAGE</p><h3>A little luxury,<br/><em>your way.</em></h3><p>{selected.length ? `${selected.length} service(s) selected` : "Choose services to start building your package."}</p><div className="total"><span>Estimated total</span><strong>EGP {total}</strong></div><button className="button primary full" onClick={submitPackage} disabled={busy}>Save my package</button><small>Prices are indicative and may be confirmed by the center.</small></aside>
        </div>
      </section>

      <section className="gallery-section section" id="gallery">
        <div className="section-head"><div><p className="eyebrow">THE DALIA TOUCH</p><h2>Little details. <em>Lovely results.</em></h2></div><p>A glimpse of the care and creativity<br/>behind every visit.</p></div>
        <div className="gallery-grid"><div className="gallery-tile gallery-one"><span>NAILS & DETAILS</span></div><div className="gallery-tile gallery-two"><span>SOFT GLAM</span></div><div className="gallery-tile gallery-three"><span>SELF-CARE MOMENTS</span></div></div>
        <p className="gallery-note">Gallery photos can be replaced with Dalia Beauty Center’s real before-and-after images before launch.</p>
      </section>

      <section className="booking-section section" id="booking">
        <div className="booking-copy"><p className="eyebrow">YOUR TIME, YOUR WAY</p><h2>Let’s make time<br/>for <em>you.</em></h2><p>Send an appointment request and our team will contact you to confirm availability.</p><div className="contact-detail"><span>✧</span><div><b>DALIA BEAUTY CENTER</b><small>Cairo, Egypt · Luxury Care</small></div></div></div>
        <form className="booking-form" onSubmit={submitBooking}>
          <p className="eyebrow">BOOK AN APPOINTMENT</p><h3>We can’t wait to see you.</h3>
          <div className="form-grid">
            <label>Your name<input required value={booking.name} onChange={e => setBooking({...booking, name:e.target.value})} placeholder="Full name"/></label>
            <label>Phone number<input required value={booking.phone} onChange={e => setBooking({...booking, phone:e.target.value})} placeholder="+20"/></label>
            <label>Email (optional)<input type="email" value={booking.email} onChange={e => setBooking({...booking, email:e.target.value})} placeholder="you@example.com"/></label>
            <label>Service<select required value={booking.service} onChange={e => setBooking({...booking, service:e.target.value})}><option value="">Choose a service</option>{services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</select></label>
            <label>Date<input required type="date" min={new Date().toISOString().split("T")[0]} value={booking.date} onChange={e => setBooking({...booking, date:e.target.value})}/></label>
            <label>Preferred time<input required type="time" value={booking.time} onChange={e => setBooking({...booking, time:e.target.value})}/></label>
          </div>
          <label>Anything we should know? (optional)<textarea rows={3} value={booking.notes} onChange={e => setBooking({...booking, notes:e.target.value})} placeholder="Tell us a little more..."/></label>
          <button className="button primary full" disabled={busy}>{busy ? "Sending..." : "Request appointment →"}</button>
          {status && <p className="form-status" role="status">{status}</p>}
          <small className="privacy-note">Your request is not confirmed until our team contacts you.</small>
        </form>
      </section>

      <section className="offer-strip"><span>✧</span><p>A little luxury is always a good idea.</p><a href="#booking">Plan your visit →</a></section>
      <footer><a className="brand" href="#home"><span className="brand-mark">D</span><span>DALIA<small>BEAUTY CENTER</small></span></a><p>Luxury Care · Cairo, Egypt</p><small>© {new Date().getFullYear()} Dalia Beauty Center. All rights reserved.</small></footer>
    </main>
  );
}
