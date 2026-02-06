import { Eye, Pen, Plus, Trash2 } from "lucide-react"
import api from "../../../services/http"

export default function AbsenceRow({ ids, abs }) {


    const handlestatus = (status) => {
        if (status == "absent") return { text: "Absence", color: "#ff000066" }
        if (status == "late") return { text: "Retard", color: "#ff7539e7" }
        return { text: "Absence Justifier", color: "#80ff9d8c" }
    }

    const handleDelete = async (id) => {

        const conf = confirm('etes vous sure que vous vouler supprimer cetter absence');
        if (conf) {
            const res = await api.delete(`absences/${id}`)
            if (res.data.success){
               alert(res.data.message) 
               window.location.reload()
            } 
            else console.log(res)
            return;
        } else return;


    }


    return <>
        <tr
            key={ids}
            style={{
                backgroundColor: handlestatus(abs.status).color
            }} >
            <td>{new Date(abs.date).toLocaleDateString('fr-FR', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</td>
            <td>{handlestatus(abs.status).text}</td>
            <td>{abs.student.full_name}</td>
            <td>{abs.student.class_group}</td>
            <td>{abs.session}</td>
            <td>{abs.status !== 'justified' ? 'NON' : "OUI"}</td>
            <td>{abs.creator.username}</td>

            <td style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
            }}>
                <button className="btn btn-sm btn-secondary" onClick={() => handleModAbsence(abs)} style={{ marginLeft: 4 }}>
                    <Pen size={14} />
                </button>
                {/* <span></span> */}
                {/* <button className="btn btn-sm" onClick={() => handleViewAbsences(t)}>
                    <Eye size={14} />
                </button> */}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(abs.id)} style={{ marginLeft: 4 }}>
                    <Trash2 size={14} />
                </button>
            </td>
        </tr>





    </>


}