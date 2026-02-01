

export default function AllStorage() {

    var archive = [],
        keys = Object.keys(localStorage),
        i = 0, key;
    for (; key = keys[i]; i++) {
        archive.push( key + ' = ' + localStorage.getItem(key));
    }

    return <>
    <h1>Local Storage Contents</h1>
    <ul >
        {archive.map((item, index) => (
            <li key={index}>{item}</li>
            
        ))}
    </ul>
    </>;
}