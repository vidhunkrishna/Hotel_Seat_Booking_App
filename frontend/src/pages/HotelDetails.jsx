import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gethotelsByid } from "../services/hotelservice.js";
import {
  Clock,
  Locate,
  LocateIcon,
  MapPin,
  Phone,
  Star,
  StarIcon,
} from "lucide-react";

function HotelDetails() {
  const { id } = useParams();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        className="w-full h-[280px] md:h-[650px] object-cover  object-center"
      />
      <div className="m-4 font-bold text-2xl text-[#171717] font-display flex flex-col">
        <div className="flex flex-row items-center">
          <div>{details.name}</div>
          <div className="font-ui text-sm ml-auto text-yellow-700">
            ★{details.rating}
          </div>
        </div>
        <div className="flex flex-row text-sm text-[#6B6B6B] items-center gap-1">
          <MapPin size={19} />
          {details.address.city},{details.address.state}
        </div>
      </div>
      <div className="bg-white w-full flex flex-col text-black font-ui p-3 m-2 rounded-xl">
        <div className="ml-3">About this hotel</div>
        <div className="text-[#6B6B6B] ml-3 mt-2">{details.description}</div>
        <hr className="text-[#6B6B6B]" />
        <div className="m-3">
          <div className="flex flex-row gap-1">
            <Phone size={19} className="text-yellow-600" />
            {details.contact}
          </div>
          <div className="flex flex-row gap-1">
            <Clock size={19} className="text-yellow-600" />
            {details.openingTime}
          </div>
          <div className="flex flex-row gap-1">
            <MapPin size={19} className="text-yellow-600" />
            {details.address.street},{details.address.city},
            {details.address.state},{details.address.pincode}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;
