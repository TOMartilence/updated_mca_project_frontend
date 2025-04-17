import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function Mmain() {
  const [data, setData] = useState([]);
  const [patientID, setPatientID] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!patientID.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientID: patientID.trim() })
      });

      const result = await response.json();
      // Convert timestamps to Date objects
      const formatted = result.map(d => ({
        ...d,
        timestamp: new Date(d.timestamp).toLocaleTimeString(), // keep only time
        bpm: parseInt(d.bpm),
        oxygen: parseInt(d.oxygen),
        temperature: parseFloat(d.temperature),
      }));
      setData(formatted.reverse());
    } catch (error) {
      console.error('❌ Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Patient Health Data</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientID}
          onChange={(e) => setPatientID(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No data found</p>
      ) : (
        <>
          {/* Table */}
          <table border="1" cellPadding="8" style={{ marginBottom: '30px' }}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>BPM</th>
                <th>Oxygen</th>
                <th>Temperature</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.patientID}</td>
                  <td>{entry.patientName}</td>
                  <td>{entry.bpm}</td>
                  <td>{entry.oxygen}</td>
                  <td>{entry.temperature}</td>
                  <td>{entry.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Charts */}
          <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
            <h3>📈 Heart Rate Over Time</h3>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bpm" stroke="#ff4d4f" name="Heart Rate (BPM)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
            <h3>🫁 Oxygen Level Over Time</h3>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="oxygen" stroke="#00b894" name="Oxygen (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <h3>🌡️ Temperature Over Time</h3>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#0984e3" name="Temp (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default Mmain;
