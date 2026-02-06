import AbsenceRow from "./absencesrow";

export default function AbsenceTable() {




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
                    <AbsenceRow />
                </tbody>
            </table>
        </div>
    </>


}