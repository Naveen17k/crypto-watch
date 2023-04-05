import React, { useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import Fuse from "fuse.js";

function CoinGeckoData() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [sortMethod, setSortMethod] = useState("rank");

  const sortCoins = data.sort((a, b) => {
    if (sortMethod === "lowToHigh") {
      return a.current_price - b.current_price;
    } else if (sortMethod === "highToLow") {
      return b.current_price - a.current_price;
    } else {
      return a.market_cap_rank - b.market_cap_rank;
    }
  });

  const links = [
    { href: "/About", label: "About" },
    { href: "/support", label: "Support" },
    { href: "/license", label: "License" },
    { href: "/sign-out", label: "Sign out" },
  ];

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false    "
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredCoins(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const options = {
      keys: ["name"],
      includeScore: true,
      threshold: 0.4,
    };
    const fuse = new Fuse(data, options); // Create a new instance of the Fuse constructor
    const filteredCoins = fuse.search(searchTerm).map((result) => result.item);
    if (searchTerm) {
      setFilteredCoins(filteredCoins);
    } else {
      setFilteredCoins(data);
    }
  }, [data, searchTerm]);

  return (
    <>
      <center>
        <div id="head" className="flex text-3xl  h-24 pt-10 justify-center">
          <div className="mt-2 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
          </div>
          Coin
          <span className="text-purple-400" id="watch">
            Watch
          </span>
        
        </div>

        <input
          className="text-black px-4 py-3 enabled:hover:border-gray-500 rounded-lg"
          type="text"
          placeholder="Search Coins"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div id="menu" className="flex flex-row">
          <Menu>
            <Menu.Button
              className="inline-flex  justify-center rounded-md bg-blue-500  px-4 py-2 text-md font-medium text-white hover:bg-opacity-70 focus:outline-double focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              id="headlessui-menu-button-:R6:"
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
              data-headlessui-state=""
            >
              Menu
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                class="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Menu.Button>

            <Menu.Items className="bg-blue-400 border-b text-black rounded-md p-3">
              <div id="menu" className="grid grid-row gap-5">
                {links.map((link) => (
                  <Menu.Item
                    as="a"
                    key={link.href}
                    href={link.href}
                    className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black border-black border-b"
                  >
                    {link.label}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>

        <div>
          <div
            id="selector"
            className="text-black flex flex-row justify-center mr-10"
          >
            <h1 className="text-white mt-2  ">Sort By</h1>

            <select
              className="p-2 ml-4 border rounded"
              value={sortMethod}
              onChange={(e) => setSortMethod(e.target.value)}
            >
              <option value="rank">Rank</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
          <div className="grid border mt-10 grid-cols-5 mx-20">
            <div className="font-bold ">Rank</div>
            <div className="font-bold">Icon</div>
            <div className="font-bold">Coin Name</div>
            <div className="font-bold">Price</div>
            <div className="font-bold">Market Cap</div>
          </div>
          <div className="mx-20">
            {filteredCoins.map((coin, index) => (
              <div className="grid mt-4 grid-cols-5" key={index}>
                <div>
                  <span className="mr-2">{coin.market_cap_rank}</span>
                </div>
                <div>
                  <img className="w-8 h-8" src={coin.image} alt={coin.name} />
                </div>
                <div>
                  <h1>{coin.name}</h1>
                </div>
                <div>
                  <span>{"$ " + coin.current_price.toFixed(2)}</span>
                </div>
                <div>
                  <span>{"$" + coin.market_cap.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </center>
    </>
  );
}

export default CoinGeckoData;
