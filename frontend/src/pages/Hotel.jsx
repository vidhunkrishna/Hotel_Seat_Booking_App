import { useEffect, useState } from "react";
import { gethotels } from "../services/hotelservice.js";
import Hotelcard from "../components/hotel/Hotelcard.jsx";
import { Search, X } from "lucide-react";

function Hotel() {
  const [hotels, sethotels] = useState([]);
  const [search, setSearch] = useState(false);
  const [term, setTerm] = useState("");
  async function getHotels() {
    try {
      const data = await gethotels();
      console.log(data);
      sethotels(data);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getHotels();
  }, []);
  const filteredhotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(term.toLowerCase()),
  );
  return (
    <div className="min-h-screen bg-[#F7F5F0] px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-[#171717]">
        Discover Hotels
      </h1>
      {!search && (
        <div
          className="m-4 flex flex-row gap-2 cursor-pointer"
          onClick={() => setSearch(!search)}
        >
          <Search />
          <h3 className="font-semibold ">Search</h3>
        </div>
      )}
      {search && (
        <div className=" relative mb-4 w-full">
          <input
            type="text"
            className="w-full rounded-xl border border-[#E5E1D8] bg-white p-3 pr-12 outline-none focus:ring-1 focus:ring-[#C89B5A]"
            placeholder="Search Hotels"
            onChange={(e) => setTerm(e.target.value)}
          />
          <X
            className="absolute right-4 top-0 flex h-full items-center justify-center text-gray-600 transition hover:text-black"
            onClick={() => setSearch(!search)}
          />
        </div>
      )}

      {filteredhotels.length === 0 ? (
        <div className="text-center">No hotels found</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredhotels.map((hotel) => (
            <Hotelcard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Hotel;
