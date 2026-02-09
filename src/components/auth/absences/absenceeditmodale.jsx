import { X } from "lucide-react";
import { useState } from "react";
import api from "../../../services/http";
import { fetchTopStudents, fetchWeeklyStats, fetchWorstStudents } from "../../utils/storage";

export default function EditAbs({ ABS, CLOSE, onUpdate }) {
    const [form, setForm] = useState({
        id: ABS.id,
        date: ABS.date ? ABS.date.substring(0, 10) : "",
        status: ABS.status || "absent",
        // Since we edit one record at a time, session is a single string "S1"
        session: ABS.session || ""
    });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // We send the single object. 
            // Laravel's update() will handle forcing duration to 0 if status is 'late'
            await api.put(`/absences/${form.id}`, form);

            if (onUpdate) onUpdate();

            window.location.reload();
            CLOSE();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Erreur lors de la modification");
        } finally {

            fetchWeeklyStats();
            fetchWorstStudents();
            fetchTopStudents();
            setSubmitting(false);
        }
    };

    const sessions = ["S1", "S2", "S3", "S4"];

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-content" style={{ maxWidth: '500px', margin: '50px auto' }}>
                <div className="modal-header">
                    <h2 className="modal-title">Modifier Absence</h2>
                    <button className="close-modal" onClick={CLOSE}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div style={{ display: "flex", gap: '20px', marginBottom: '15px' }}>
                        <div className="form-group flex-1">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="input"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                            />
                        </div>

                        <div className="form-group flex-1">
                            <label className="form-label">Statut</label>
                            <select
                                className="input"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="absent">Absence</option>
                                <option value="late">Retard</option>
                                <option value="justified">Absence Justifiée</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Session (Séance)</label>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                            {sessions.map((s) => (
                                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input
                                        type="radio" // Changed to Radio because one record = one session
                                        name="session"
                                        value={s}
                                        checked={form.session === s}
                                        onChange={(e) => setForm({ ...form, session: e.target.value })}
                                    />
                                    {s}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer" style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: '30px' }}>
                        <button type="button" className="btn btn-secondary" onClick={CLOSE}>Annuler</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Enregistrement..." : "Enregistrer les modifications"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}