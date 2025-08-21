//     import { useEffect, useState } from "react";
// import axios from "axios";
// import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

// export default function CoinChart({ coinId }) {
//   const [chartData, setChartData] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!coinId) return; // 🚨 Skip if no coinId provided

//     const fetchChart = async () => {
//       try {
//         const response = await axios.get(
//           `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
//           {
//             params: {
//               vs_currency: "usd",
//               days: 7, // last 7 days
//             },
//           }
//         );

//         // ✅ Format prices for Recharts
//         const formatted = response.data.prices.map(([time, price]) => ({
//           time: new Date(time).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//           }),
//           price,
//         }));

//         setChartData(formatted);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching chart data", err);
//         setError("Failed to load chart");
//         setChartData([]);
//       }
//     };

//     fetchChart();
//   }, [coinId]);

//   return (
//     <div style={{ width: "100%", height: "200px" }}>
//       {error ? (
//         <p style={{ color: "red", textAlign: "center" }}>{error}</p>
//       ) : (
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData}>
//             <Line
//               type="monotone"
//               dataKey="price"
//               stroke="#3b82f6"
//               strokeWidth={2}
//               dot={false}
//             />
//             <Tooltip /> {/* ✅ show price on hover */}
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }
