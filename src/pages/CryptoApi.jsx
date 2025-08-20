import React, { useEffect, useState } from "react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

function CryptoApi() {
  const [coinId, setCoinId] = useState(null);
  const [currentData, setCurrentDatea] = useState(null);
  const [topCoin, setTopCoin] = useState([]);
  const [showToggle, setShowToggle] = useState(false);

  const popularCoin = ["bitcoin", "ethereum", "solana", "tether", "dogecoin"];

  //   const [yesterdayData, setYesterdayDatea] = useState(null);
  //   const [weekData, setWeekDatea] = useState(null);
  //   const [monthData, setMonthDatea] = useState(null);
  //   const [yearData, setYearDatea] = useState(null);

  // const formatDate = (daysAgo) => {
  //   const d = new Date();
  //   d.setDate(d.getDate() - daysAgo);
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const year = d.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!coinId) return;
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`
      );
      setCurrentDatea(response.data);
      console.log(currentData);
      setShowToggle(true);
    } catch (error) {
      console.error("This is current price section", error);
    }
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const responses = await Promise.all(
          popularCoin.map((coin) =>
            axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`)
          )
        );
        const coinDetail = responses.map((res) => res.data);
        setTopCoin(coinDetail);
        console.log("All Coin Data:", coinDetail);
      } catch (error) {
        console.error("Error fetching coins", error);
      }
    };

    fetchCoinData();
  }, []);

  return (
    <div className="w-full p-[5%] text-white relatice">
      <div className="sm:w-[75%] md-w-[68%] lg:w-[60%] mx-auto text-center">
        <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold capitalize">
          Largest <br /> Crypto marketplace
        </h1>
        <div className="mx-auto my-[5%] bg-white flex items-center justify-center py-1 rounded-md">
          <form onSubmit={submitHandler} className="w-full">
            <input
              type="text"
              placeholder="enter coin name"
              className="p-2 w-[70%] xs:w-[75%] sm:w-[80%] outline-none text-black"
              onChange={(e) => setCoinId(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-btn text-white py-2 w-[28%] xs:w-[23%] sm:w-[18%] rounded-md"
            >
              Submit
            </button>
          </form>
        </div>

        <table className="w-full bg-deepPurple border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">#</th>
              <th className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">Coin</th>
              <th className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">Price</th>
              <th className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">Status</th>
              <th className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">Market Cap</th>
              <th className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">Predection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topCoin.map((famousCoin, index) => (
              <tr key={index}>
                <td className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">
                  {index + 1}
                </td>
                <td className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start font-semibold text-gray-400 capitalize flex items-center gap-2">
                  <img
                    src={famousCoin?.image?.small}
                    alt={famousCoin?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  {famousCoin?.name}
                </td>
                <td className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">
                  {famousCoin?.market_data?.current_price?.usd
                    ? `$${famousCoin.market_data.current_price.usd}`
                    : "Loading..."}
                </td>
                <td
                  className={
                    famousCoin?.market_data?.price_change_percentage_24h >= 0
                      ? "text-green-600 text-start"
                      : "text-red-600 text-start"
                  }
                >
                  {famousCoin?.market_data?.price_change_percentage_24h?.toFixed(
                    2
                  ) || "0"}
                  %
                </td>
                <td className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">
                  {famousCoin?.market_data?.market_cap?.usd || "Loading..."}
                </td>
                <td className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] font-bold text-start">
                  {famousCoin?.market_data?.price_change_percentage_24h > 0 ? (
                    <span className="text-green-600">UP 📈</span>
                  ) : (
                    <span className="text-red-600">DOWN 📉</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={`absolute w-full bg-gray-900 top-0 start-0 h-[100vh] items-center justify-center ${
          showToggle ? "flex" : "hidden"
        }`}
      >
        <div className="w-[60%] py-[12px] bg-white shadow-2xl rounded-md relative">
          <div
            className="absolute top-5 end-5"
            onClick={() => setShowToggle(false)}
          >
            <RxCross2 className="text-[36px] hover:cursor-pointer text-black" />
          </div>
          <h1 className="text-black py-[10px] text-center text-[24px] font-semibold">Welcome to Predection Cell</h1>
          <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="sm:px-2 md:px-3 lg:px-4 py-2 text-[12px] sm:text-[14px] text-start">#</th>
                <th className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start">Coin</th>
                <th className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start">Price</th>
                <th className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start">Status</th>
                <th className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start">Market Cap</th>
                <th className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start">Predection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start text-gray-900">
                  1
                </td>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start text-gray-900 font-semibold text-gray-400 capitalize flex items-center gap-2">
                  <img
                    src={currentData?.image?.small}
                    alt={currentData?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  {currentData?.name}
                </td>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start text-gray-900">
                  {currentData?.market_data?.current_price?.usd
                    ? `$${currentData.market_data.current_price.usd}`
                    : "Loading..."}
                </td>
                <td
                  className={
                    currentData?.market_data?.price_change_percentage_24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {currentData?.market_data?.price_change_percentage_24h?.toFixed(
                    2
                  ) || "0"}
                  %
                </td>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] text-start text-gray-900">
                  {currentData?.market_data?.market_cap?.usd || "Loading..."}
                </td>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2 text-[18px] font-bold text-start">
                  {currentData?.market_data?.price_change_percentage_24h > 0 ? (
                    <span className="text-green-600">UP 📈</span>
                  ) : (
                    <span className="text-red-600">DOWN 📉</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="absolute top-7 end-10"
          onClick={() => setShowToggle(false)}
        >
          <RxCross2 className="text-[42px] hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default CryptoApi;
