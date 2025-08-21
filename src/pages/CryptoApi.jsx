import React, { useEffect, useState } from "react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

function CryptoApi() {
  const [coinId, setCoinId] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [topCoin, setTopCoin] = useState([]);
  const [showToggle, setShowToggle] = useState(false);
  const popularCoin = ["bitcoin", "ethereum", "solana", "tether", "dogecoin"];

  // submitedhandler

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!coinId) {
      alert("Please enter a coin name");
      return;
    }
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: coinId.toLowerCase(),
            price_change_percentage: "24h,7d,14d,30d,200d,1y",
          },
        }
      );

      if (response.data.length > 0) {
        setCurrentData(response.data[0]);
        setShowToggle(true);
      } else {
        alert(`Coin "${coinId}" is not found! Please try again.`);
        setCurrentData(null);
        setShowToggle(false);
      }
    } catch (error) {
      console.error("This is current price section", error);
      alert("Something went wrong! Please try again.");
    }
  };

  // topCoins Api

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );

        setTopCoin(response.data);
        console.log("All Coin Data:", response.data);
      } catch (error) {
        console.error("Error fetching coins", error);
      }
    };

    fetchCoinData();
  }, []);
  return (
    <div className="w-full py-[5%] sm:p-[5%] text-white relatice">
      <div className="sm:w-[75%] md-w-[68%] lg:w-[60%] mx-auto text-center">
        <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold capitalize">
          Largest <br /> Crypto marketplace
        </h1>
        <div className="mx-auto my-[5%] bg-white flex items-center justify-center py-1 rounded-md">
          {/* ----------------- input Field ----------------- */}
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
        {/* ----------------- topCoin table ----------------- */}
        <table className="w-full bg-deepPurple shadow-md rounded-lg border border-gray-300 overflow-hidden">
          <thead className="bg-gray-600 text-white">
           <tr>
                {["#", "Coin", "Price", "Status", " Market Cap", "Predection"].map(
                  (header, idx) => (
                    <th
                      key={idx}
                      className="px-2 sm:px-3 lg:px-4 py-2 text-left text-xs sm:text-sm"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topCoin
              .filter((coin) => popularCoin.includes(coin.id))
              .map((famousCoin, index) => (
                <tr key={index}>
                  <td className="px-1 sm:px-2 md:px-3 lg:px-4 py-2 xs:text-[12px] sm:text-[14px] text-start">
                    {index + 1}
                  </td>
                  <td className="px-1 sm:px-2 md:px-3 lg:px-4 py-2 xs:text-[12px] sm:text-[14px] text-start font-semibold text-gray-400 capitalize flex items-center gap-2">
                    <img
                      src={famousCoin?.image}
                      alt={famousCoin?.name}
                      className="w-6 h-6 rounded-full"
                    />
                    {famousCoin?.name}
                  </td>
                  <td className="px-1 sm:px-2 md:px-3 lg:px-4 py-2 xs:text-[12px] sm:text-[14px] text-start">
                    {famousCoin?.current_price
                      ? `$${famousCoin?.current_price}`
                      : "Loading..."}
                  </td>
                  <td
                    className={
                      famousCoin?.price_change_percentage_24h >= 0
                        ? "text-green-600 text-start text-[12px] sm:text-[14px]"
                        : "text-red-600 text-start text-[12px] sm:text-[14px]"
                    }
                  >
                    {famousCoin?.price_change_percentage_24h?.toFixed(2) || "0"}
                    %
                  </td>

                  <td className="px-1 sm:px-2 md:px-3 lg:px-4 py-2 xs:text-[12px] sm:text-[14px] text-start">
                    {famousCoin?.market_cap || "Loading..."}
                  </td>
                  <td className="px-1 sm:px-2 md:px-3 lg:px-4 py-2 xs:text-[12px] sm:text-[14px] font-bold text-start">
                    {famousCoin?.price_change_percentage_24h > 0 ? (
                      <span className="text-green-600 text-[12px] sm:text-[14px]">
                        UP 📈
                      </span>
                    ) : (
                      <span className="text-red-600 text-[12px] sm:text-[14px]">
                        DOWN 📉
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ----------------- history table ----------------- */}
      <div
        className={`absolute w-full bg-gray-900 top-0 start-0 py-[25%] sm:py-[22%] lg:py-[16%] items-center justify-center ${
          showToggle ? "flex" : "hidden"
        }`}
      >
        <div className="w-[95%] sm:w-[75%] md-w-[68%] lg:w-[60%]  py-[12px] bg-white shadow-2xl rounded-md relative">
          <div
            className="absolute top-2 end-5"
            onClick={() => setShowToggle(false)}
          >
            <RxCross2 className=" text-[25px] sm:text-[36px] hover:cursor-pointer text-black" />
          </div>
          <h1 className="text-black py-[10px] text-center sm:text-[24px] font-semibold">
            Welcome to Predection Cell
          </h1>
          <table className="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-600 text-white">
              <tr>
                {["#", "Coin", "Price", "Status", " Market Cap", "Predection"].map(
                  (header, idx) => (
                    <th
                      key={idx}
                      className="px-2 sm:px-3 lg:px-4 py-2 text-left text-xs sm:text-sm"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                  1
                </td>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900 font-semibold text-gray-400 capitalize flex items-center gap-2">
                  <img
                    src={currentData?.image}
                    alt={currentData?.name}
                    className="hidden sm:block w-6 h-6 rounded-full"
                  />
                  {currentData?.name}
                </td>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                  {currentData?.current_price
                    ? `$${currentData?.current_price}`
                    : "Loading..."}
                </td>
                <td
                  className={
                    currentData?.price_change_percentage_24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {currentData?.price_change_percentage_24h?.toFixed(2) || "0"}%
                </td>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                  {currentData?.market_cap || "Loading..."}
                </td>
                <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]font-bold text-start">
                  {currentData?.price_change_percentage_24h > 0 ? (
                    <span className="text-green-600">UP 📈</span>
                  ) : (
                    <span className="text-red-600">DOWN 📉</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="w-full py-2">
            <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-600 text-white">
                <tr>
                  {["#", "Coin", "24h", "7d", "14d", "1m", "6m", "1y"].map(
                    (header, idx) => (
                      <th
                        key={idx}
                        className="px-2 sm:px-3 lg:px-4 py-2 text-left text-xs sm:text-sm"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                    1
                  </td>
                  <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900 font-semibold text-gray-400 capitalize flex items-center gap-2">
                    <img
                      src={currentData?.image}
                      alt={currentData?.name}
                      className="hidden sm:block w-6 h-6 rounded-full"
                    />
                    {currentData?.name}
                  </td>
                  <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                    {currentData?.price_change_percentage_24h_in_currency?.toFixed(
                      2
                    )}
                    %
                  </td>
                  <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                    {currentData?.price_change_percentage_7d_in_currency?.toFixed(
                      2
                    )}
                    %
                  </td>
                  <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                    {currentData?.price_change_percentage_14d_in_currency?.toFixed(
                      2
                    )}
                    %
                  </td>
                  <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                    {currentData?.price_change_percentage_30d_in_currency?.toFixed(
                      2
                    )}
                    %
                  </td>
                  <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                    {currentData?.price_change_percentage_200d_in_currency?.toFixed(
                      2
                    )}
                    %
                  </td>
                  <td className="sm:px-1 md:px-3 lg:px-4 py-2xs:text-[12px] sm:text-[14px]text-start text-gray-900">
                    {currentData?.price_change_percentage_1y_in_currency?.toFixed(
                      2
                    )}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
