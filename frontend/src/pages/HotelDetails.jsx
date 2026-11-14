import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gethotelsByid } from "../services/hotelservice.js";
import {
  Clock,
  MapPin,
  Phone,
} from "lucide-react";

function HotelDetails() {
  const { id } = useParams();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function getdetails() {
      try {
        setLoading(true);
        setError("");

        const data = await gethotelsByid(id);
        console.log("Hotel details:", data);

        setDetails(data);
      } catch (e) {
        console.error("Failed to fetch hotel:", e);
        setError("Unable to fetch hotel details.");
      } finally {
        setLoading(false);
      }
    }

    getdetails();
  }, [id]);

  if (loading) {
    return <div>Loading hotel details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!details) {
    return <div>Hotel not found.</div>;
  }

  return (
    <div className="bg-[#F7F5F0]">
      <img
        src={details.imageurl || "/back.jpg"}
        alt={details.name}
        className="w-full h-[280px] md:h-[650px] object-cover  object-center"
      />
      <div className="px-4 pb-4">
        <div className="m-4 font-bold text-2xl text-[#171717] font-display flex flex-col">
          <div className="flex flex-row items-center">
            <div className="text-2xl font-bold">{details.name}</div>
            <div className="font-ui text-base font-semibold ml-auto text-yellow-700">
              ★{details.rating}
            </div>
          </div>
          <div className="flex flex-row text-sm text-[#6B6B6B] items-center gap-1">
            <MapPin size={19} />
            {details.address.city},{details.address.state}
          </div>
        </div>
        <div className="bg-white w-full flex flex-col text-black font-ui p-3 my-2 rounded-xl">
          <div className="ml-3 text-lg font-semibold">About this hotel</div>
          <div className="text-[#6B6B6B] ml-3 mt-2 text-base leading-relaxed">
            {details.description}
          </div>
          <hr className="text-[#6B6B6B]" />
          <div className="m-3">
            <div className="flex flex-row gap-1">
              <Phone size={19} className="text-yellow-600 text-base" />
              {details.contact}
            </div>
            <div className="flex flex-row gap-1">
              <Clock size={19} className="text-yellow-600" />
              {details.openingTime} - {details.closingTime}
            </div>
            <div className="flex flex-row items-start gap-2">
              <MapPin size={19} className="mt-1 shrink-0 text-yellow-600" />

              <span>
                {details.address.street}, {details.address.city},{" "}
                {details.address.state}, {details.address.pincode}
              </span>
            </div>
          </div>
        </div>
        <button
          className="bg-yellow-600 rounded-2xl cursor-pointer hover:bg-yellow-700 shadow-2xl w-full p-4  text-lg font-bold text-white"
          onClick={() => navigate(`/hotels/${id}/tables`)}
        >
          Explore Tables →
        </button>
      </div>
    </div>
  );
}

export default HotelDetails;
