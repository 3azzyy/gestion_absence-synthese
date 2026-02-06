import { X } from "lucide-react";
import { useState } from "react";
import api from "../../../services/http"; // Ensure this path is correct

export default function EditAbs({ ABS, CLOSE, onUpdate }) {
    const [form, setForm] = useState({
        id: ABS.id,
        // Helper to ensure date is always YYYY-MM-DD for the input
        date: ABS.date ? ABS.date.substring(0, 10) : "",
        status: ABS.status || "absent",
        session: ABS.session ? ABS.session.split(',').filter(Boolean) : [] || "" // Assuming session is stored as "S1", "S2", etc.
    });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Adjust the URL to match your Laravel route (e.g., PUT /api/absences/{id})
            await api.put(`/absences/${form.id}`, form);
            if (onUpdate) onUpdate(); // Refresh the list in the parent component
            CLOSE();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Erreur lors de la modification");
        } finally {
            setSubmitting(false);
        }
    };

    // Sessions list
    const sessions = ["S1", "S2", "S3", "S4"];

    return (
        <div className="modal show">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">Modifier Absence</h2>
                    <button className="close-modal" onClick={CLOSE}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div style={{
                        display: "flex",
                        flexDirection: 'rows',
                    justifyContent: 'space-evenly',
                    }}>
                    <div className="form-group mb-6">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="input"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                    </div>

                    <div className="form-group mb-6">
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
            <div className="form-group mb-4" style={{alignItems:"center",marginTop:"14px"}} >
                <label className="form-label">Session</label>
                <div style={{ display: 'flex', gap: '15px'}}>
                    {sessions.map((s) => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="session"
                                value={s}
                                checked={form.session.includes(s)}
                                onChange={(e) => {
                                    const { value, checked } = e.target;
                                    let updatedSessions = [...form.session];
                                    if (checked) {

                                        if (!updatedSessions.includes(value)) updatedSessions.push(value);
                                    } else {

                                        updatedSessions = updatedSessions.filter(item => item !== value);
                                    }

                                    setForm({ ...form, session: updatedSessions });
                                }}
                            />
                            {s}
                        </label>
                    ))}
                </div>
            </div>

            <div className="modal-footer" style={{ padding: 0, marginTop: '20px',display:"flex",gap:"20px",justifyContent:"center" }}>
                <button type="button" className="btn btn-secondary" onClick={CLOSE}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>
        </form>
            </div >
        </div >
    );
}