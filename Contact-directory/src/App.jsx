import { useState } from "react";
import '../src/App.css';
const emptyForm = { name: "", phone: "", email: "" };
export default function ContactDirectory() {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Asif", phone: "0300-1234567", email: "Asif@example.com" },
  ]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, email } = form;
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Fill in name, phone and email.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const clean = { name: name.trim(), phone: phone.trim(), email: email.trim() };

    if (editingId === null) {
      setContacts((prev) => [...prev, { id: Date.now(), ...clean }]);
    } else {
      setContacts((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...clean } : c))
      );
    }
    resetForm();
  };

  const startEdit = (contact) => {
    setEditingId(contact.id);
    setForm({ name: contact.name, phone: contact.phone, email: contact.email });
    setError("");
  };

  const handleDelete = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="cd">
      <div className="cd-wrap">
        <h1>Contact directory</h1>
        <p className="sub">Add people, then edit or remove them anytime.</p>

        <form className="cd-form" onSubmit={handleSubmit} noValidate>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="0300-0000000" />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@example.com" />
          </label>
          <div className="actions">
            <button type="submit" className="primary">
              {editingId === null ? "Add contact" : "Save changes"}
            </button>
            {editingId !== null && (
              <button type="button" onClick={resetForm}>Cancel</button>
            )}
          </div>
          {error && <p className="err" role="alert">{error}</p>}
        </form>

        <div className="cd-count">
          {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
        </div>

        {contacts.length === 0 ? (
          <div className="empty">No contacts yet. Use the form above to add your first one.</div>
        ) : (
          <div className="cd-grid">
            {contacts.map((c) => (
              <article key={c.id} className={`cd-card${c.id === editingId ? " editing" : ""}`}>
                <h3>{c.name}</h3>
                <p>{c.phone}</p>
                <p>{c.email}</p>
                <div className="actions">
                  <button onClick={() => startEdit(c)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}