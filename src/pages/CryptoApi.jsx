import React, { useEffect, useState } from "react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { FaSearch, FaBitcoin } from "react-icons/fa";
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";

// ... (keep your formatMoney and PercentChange helpers exactly as they were) ...

function formatMoney(num) {
  if (!num) return "$0.00";
  if (num >= 1_000_000_000_000) return "$" + (num / 1_000_000_000_000).toFixed(2) + "T";
  if (num >= 1_000_000_000) return "$" + (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return "$" + (num / 1_000_000).toFixed(2) + "M";
  return "$" + num.toLocaleString();
}

const PercentChange = ({ value }) => {
  if (!value) return <span className="text-gray-400">-</span>;
  const isPositive = value >= 0;
  return (
    <div className={`flex items-center gap-1 font-semibold ${isPositive ? "text-green-400" : "text-red-500"}`}>
      {isPositive ? <BsGraphUpArrow size={12} /> : <BsGraphDownArrow size={12} />}
      {Math.abs(value).toFixed(2)}%
    </div>
  );
};

function CryptoApi() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null); 
  const [topCoins, setTopCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  // ... (keep the useEffect for fetching Top Coins exactly as it was) ...
  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 20,
              page: 1,
              sparkline: false,
            },
          }
        );
        setTopCoins(response.data);
      } catch (error) {
        console.error("Error fetching top coins:", error);
      }
    };
    fetchTopCoins();
  }, []);

  // ---------------------------------------------------------
  //  UPDATED SEARCH HANDLER (Supports Symbol & Name)
  // ---------------------------------------------------------
  const searchHandler = async (e) => {
    e.preventDefault();
    if (!searchInput) return;

    setLoading(true);
    try {
      // Step 1: Search for the Coin ID first (e.g., "btc" -> "bitcoin")
      const searchResult = await axios.get(`https://api.coingecko.com/api/v3/search?query=${searchInput}`);
      
      if (searchResult.data.coins.length > 0) {
        // Get the ID of the first/best match
        const coinId = searchResult.data.coins[0].id;

        // Step 2: Fetch the Market Data using that ID
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: coinId, // Use the ID we just found
              price_change_percentage: "1h,24h,7d,14d,30d,200d,1y",
            },
          }
        );

        if (response.data.length > 0) {
          setSelectedCoin(response.data[0]);
          setSearchInput(""); 
        } else {
          alert("Market data not available for this coin.");
        }
      } else {
        alert("Coin not found! Please check the name or symbol.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error finding coin. API limit might be reached.");
    } finally {
      setLoading(false);
    }
  };

  // ... (keep the rest of the return statement / JSX exactly the same) ...
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-gray-100 font-sans pb-10">
      
      {/* Header & Search */}
      <div className="w-full bg-gradient-to-r from-[#14141a] to-[#0f0f13] border-b border-gray-800 shadow-xl pb-12 pt-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3 text-yellow-500 mb-2">
            <FaBitcoin className="text-4xl animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Crypto <span className="text-blue-500">Hunter</span>
            </h1>
          </div>
          <p className="text-gray-400">Track market trends & analyze coin performance in real-time.</p>
          
          <form onSubmit={searchHandler} className="relative max-w-lg mx-auto mt-6">
            <input
              type="text"
              placeholder="Search symbol (BTC) or name (Bitcoin)..."
              className="w-full py-4 pl-6 pr-14 rounded-full bg-[#1e1e24] border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white transition-all shadow-lg"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaSearch size={18} />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Market Table */}
      <div className="max-w-6xl mx-auto mt-[-40px] px-4">
        <div className="bg-[#13131a] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800 bg-[#1a1a22]">
            <h2 className="text-xl font-bold text-white">Top Market Movers</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0f0f13] text-gray-400 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">24h Change</th>
                  <th className="px-6 py-4 text-right hidden md:table-cell">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topCoins.map((coin) => (
                  <tr 
                    key={coin.id} 
                    className="hover:bg-[#1c1c26] transition-colors cursor-pointer group"
                    onClick={() => {
                        // Optional: Allow clicking row to view details
                        setSearchInput(coin.id);
                        // Ideally you would trigger the fetch logic here directly, 
                        // but setting searchInput allows the user to just hit enter or you can call a helper.
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{coin.name}</p>
                          <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-200">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <PercentChange value={coin.price_change_percentage_24h} />
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 hidden md:table-cell">
                      {formatMoney(coin.market_cap)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedCoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181820] w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden relative animate-fadeIn">
            
            <button 
              onClick={() => setSelectedCoin(null)}
              className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-all text-gray-400"
            >
              <RxCross2 size={24} />
            </button>

            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 text-center border-b border-gray-700">
              <img src={selectedCoin.image} alt="coin" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg" />
              <h2 className="text-3xl font-bold text-white mb-1 capitalize">{selectedCoin.name}</h2>
              <h3 className="text-4xl font-extrabold text-blue-400 my-2">
                ${selectedCoin.current_price.toLocaleString()}
              </h3>
              <div className="flex justify-center gap-4 text-sm text-gray-400 mt-2">
                <span>Rank #{selectedCoin.market_cap_rank}</span>
                <span>•</span>
                <span>Cap: {formatMoney(selectedCoin.market_cap)}</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Performance Analysis</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TimeFrameCard label="24 Hours" value={selectedCoin.price_change_percentage_24h_in_currency} />
                <TimeFrameCard label="7 Days" value={selectedCoin.price_change_percentage_7d_in_currency} />
                <TimeFrameCard label="30 Days" value={selectedCoin.price_change_percentage_30d_in_currency} />
                <TimeFrameCard label="1 Year" value={selectedCoin.price_change_percentage_1y_in_currency} />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const TimeFrameCard = ({ label, value }) => {
  return (
    <div className="bg-[#23232e] p-4 rounded-xl text-center border border-gray-700 hover:border-blue-500/50 transition-colors">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <div className="flex justify-center">
         <PercentChange value={value} />
      </div>
    </div>
  );
};

export default CryptoApi;