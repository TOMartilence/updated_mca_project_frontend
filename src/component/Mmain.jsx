import { useEffect, useState } from 'react'

function Mmain() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>Patient Health Data</h1>
      <table>
        <thead>
          <tr>
            <th>BPM</th>
            <th>Oxygen</th>
            <th>Temperature</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.bpm}</td>
              <td>{entry.oxygen}</td>
              <td>{entry.temperature}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Mmain;
