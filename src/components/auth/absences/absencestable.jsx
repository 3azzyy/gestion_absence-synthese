import EmptyState from "../common/classes/EmptyState";
import AbsenceRow from "./absencesrow";

export default function AbsenceTable({absences}) {




    return <>
        <div className="table-wrapper">
            <style>
                {`
                    th, td {  
                    text-align: center!important;
                    }
                `}
            </style>
            <table className="table">
                <thead>
                    <tr>
                        <th>Date d'Infraction</th>
                        <th>type d'Infraction</th>
                        <th>Nom complet</th>
                        <th>Groupe</th>
                        <th>sessions</th>
                        <th>Justification</th>
                        <th>Createur</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {absences.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ padding: 0 }}>
                                <EmptyState
                                    message="Aucun stagiaire trouvé"
                                    description="Commencez par ajouter des stagiaires ou ajustez vos filtres"
                                />
                            </td>
                        </tr>
                    ) : (
                        absences.map(abs => (
                            <AbsenceRow
                                key={abs.id}
                                abs={abs}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </>


}