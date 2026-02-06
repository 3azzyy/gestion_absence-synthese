import { Eye, Pen, Plus, Trash2 } from "lucide-react"

export default function AbsenceRow({ key, abs }) {


    console.log(abs)


    return <>
        <tr key={key}>
            <td>{abs.date}</td>
            <td>{abs.status}</td>
            <td>{abs.student.full_name}</td>
            <td>{abs.student.class_group}</td>
            <td>{abs.session}</td>
            <td>{abs.status !== 'justified' ? 'NON JUSTIFIER' : abs.status}</td>
            <td>{abs.creator.username}</td>

            <td style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
            }}>
                <button className="btn btn-sm btn-secondary" onClick={() => handleAddAbsence(t)} style={{ marginLeft: 4 }}>
                    <Pen size={14} />
                </button>
                <span></span>
                <button className="btn btn-sm" onClick={() => handleViewAbsences(t)}>
                    <Eye size={14} />
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDeleteClick(t.id)} style={{ marginLeft: 4 }}>
                    <Trash2 size={14} />
                </button>
            </td>
        </tr>





    </>


}