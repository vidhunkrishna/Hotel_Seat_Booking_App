import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gethotelsByid, gettables } from "../services/hotelservice.js";
import { MapPin, Utensils, Users } from "lucide-react";

function Tables() {
  const { id } = useParams();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hotel, setHotel] = useState(null);
  const [selectedtable, setSelectedtable] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const gettable = async () => {
      try {
        setLoading(true);
        setError("");
        const [hoteldata, tabledata] = await Promise.all([
          gethotelsByid(id),
          gettables(id),
        ]);
        setTables(tabledata);
        setHotel(hoteldata);
      } catch (e) {
        console.error("Failed to fetch table:", e);
        setError("Unable to fetch tables.");
      } finally {
        setLoading(false);
      }
    };
    gettable();
  }, [id]);
  console.log(tables);
  const sections = [
    ...new Set(tables.map((table) => table.location || "General Area")),
  ];
  if (loading) {
    return <div>Loading Tables....</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="bg-[#F7F5F0]">
      <div className="bg-white rounded-xl p-6 text-center mb-8">
        <h1 className="text-3xl font-bold">{hotel?.name}</h1>
        <p className="text-gray-500 mt-2">
          <MapPin size={16} className="inline" /> {hotel?.address?.city},{" "}
          {hotel?.address?.state}
        </p>
        <p className="mt-2 text-gray-500">Choose your preferred table</p>
      </div>
      <div className="flex justify-center gap-4 mb-8 text-sm">
        <span className="h-4 w-4 rounded border border-green-600 bg-green-500" />
        <p>Available</p>
        <span className="h-4 w-4 rounded border border-red-600 bg-red-500" />
        <p>Inactive</p>
        <span className="h-4 w-4 rounded border border-yellow-600 bg-yellow-500" />
        <p>Selected</p>
      </div>
      <div className="bg-white rounded-xl p-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-bold tracking-widest text-[#C89B5A]">
            HOTEL SEAT BOOKING
          </p>

          <div className="h-1 bg-gray-200 w-3/4 mx-auto mt-3 rounded" />

          <p className="text-xs mt-2 text-gray-500">DINING AREA</p>
        </div>
        <div>
          {sections.map((section) => {
            const sectiontables = tables.filter(
              (table) => (table.location || "General Area") === section,
            );
            return (
              <div key={section}>
                <div className="mb-10">
                  <h2 className="text-center text-lg font-bold mb-2">
                    {section.toUpperCase()}
                  </h2>
                  <h2 className="text-center text-sm text-gray-600">
                    {sectiontables.length} tables
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
                  {sectiontables.map((tab) => {
                    const isSelected = selectedtable.some(
                      (selected) => selected._id === tab._id,
                    );

                    return (
                      <button
                        key={tab._id}
                        disabled={tab.status !== "Active"}
                        className={`h-16 rounded-lg border flex items-center justify-center gap-2
    ${
      isSelected
        ? "bg-yellow-100 border-yellow-600 text-yellow-800 hover:bg-yellow-200"
        : tab.status === "Active"
          ? "bg-green-100 border-green-600 text-green-800 hover:bg-green-200"
          : "bg-red-100 border-red-500 text-red-700 cursor-not-allowed"
    }`}
                        onClick={() => {
                          setSelectedtable((prev) =>
                            isSelected
                              ? prev.filter(
                                  (selected) => selected._id !== tab._id,
                                )
                              : [...prev, tab],
                          );
                        }}
                      >
                        <Utensils size={20} />

                        <div className="flex flex-col items-center">
                          <span className="font-semibold">
                            Table {tab.tableNumber}
                          </span>
                          <span className="text-xs flex items-center gap-1">
                            <Users size={12} />
                            {tab.capacity} people
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {selectedtable.length > 0 && (
          <div className="border-t border-gray-200 mt-8 pt-6">
            <h2 className="text-lg font-bold mb-4">
              Selected Tables ({selectedtable.length})
            </h2>

            <div className="space-y-3">
              {selectedtable.map((tab) => (
                <div
                  key={tab._id}
                  className="flex justify-between items-center border rounded-lg p-4"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">Table {tab.tableNumber}</p>
                    <p className="text-sm text-gray-500">
                      Capacity: {tab.capacity} people
                    </p>
                    <p className="text-sm text-gray-500">
                      Location: {tab.location}
                    </p>
                    <p className="text-sm text-gray-500">Price: ₹{tab.price}</p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedtable((prev) =>
                        prev.filter((selected) => selected._id !== tab._id),
                      )
                    }
                    className="text-sm text-red-600 bg-red-100 p-3 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold mt-5">
              <span>Total Price</span>
              <span>
                ₹{selectedtable.reduce((total, tab) => total + tab.price, 0)}
              </span>
            </div>

            <button
              className="w-full mt-6 bg-[#C89B5A] text-white py-3 rounded-lg font-semibold hover:bg-[#B88746] cursor-pointer"
              onClick={() => navigate("")}
            >
              Continue to Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tables;
