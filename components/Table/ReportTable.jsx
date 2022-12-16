import React, { useState, useRef, useEffect } from "react";
import { getRentalBill } from "../../services/rental.services";
import { getRepairBill } from "../../services/repair.services";
import { getAllUsers } from "../../services/user.services";
import { getUtilityBill } from "../../services/utility.services";
import moment from "moment";
import { DropletSvg, ThunderSvg, XSvg } from "../../components/Svg";
import ModalLayout from "../Layout/ModalLayout";
const ReportTable = ({ tab }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [units, setUnits] = useState();
  const totalRef = useRef(0);
  const [imageModal, setImageModal] = useState(null);
  const [receiver, setReceiver] = useState();
  const [proofModal, setProofModal] = useState(null);

  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const searchListRef = useRef();
  const [search, setSearch] = useState();

  const [typeofutility, setTypeofutility] = useState("Electrical");
  const [page, setPage] = useState(1);
  const [newSlice, setNewSlice] = useState(null);
  const MAX = 4;
  const paginationHandler = (item) => {
    setPage(item);
    setNewSlice(data.slice(item * MAX - MAX, item * MAX));
  };
  useEffect(() => {
    reload();
    setIsLoading(true);
  }, [tab, from, to, typeofutility, receiver]);
  const reload = () => {
    const load = async () => {
      switch (tab) {
        case 0:
          fetchRental();
          break;
        case 1:
          fetchRepair();
          break;
        case 2:
          fetchUtility();
          break;
      }
      const res = await getAllUsers();
      if (res.success) {
        searchListRef.current = res.data;
        setUnits(res.data);
      }
      setIsLoading(false);
    };
    load();
    setData([]);
  };
  const fetchRental = async () => {
    const newData = {
      from,
      to,
      unit: receiver?.unit,
    };

    const res = await getRentalBill(newData);
    if (res.success) {
      setData(res.data);
      console.log(res.data);
      setNewSlice(res.data?.slice(0, MAX));
    }
  };
  const fetchRepair = async () => {
    const newData = {
      from,
      to,
      unit: receiver?.unit,
    };

    const res = await getRepairBill(newData);
    if (res.success) {
      setData(res.data);
      setNewSlice(res.data?.slice(0, MAX));
    }
  };
  const fetchUtility = async () => {
    const newData = {
      unit: receiver?.unit,
      typeofutility,
    };
    const res = await getUtilityBill(newData);
    if (res.success) {
      setData(res.data);
      setNewSlice(res.data?.slice(0, MAX));
    }
  };
  const headers = [
    [
      "unit",
      "payment mode",
      "payment date",
      // "month coverage",
      "amount",
      "rent started",
      "receipt",
    ],
    [
      "unit",
      "payment mode",
      "payment date",
      "description",
      "amount",
      "receipt",
    ],
    ["date of payment", "date of coverage", "proof of payment"],
  ];
  const unitsFiltered = searchListRef.current?.filter(
    (u) =>
      u.firstname.toLowerCase().includes(search?.toLowerCase()) ||
      u.lastname.toLowerCase().includes(search?.toLowerCase()) ||
      u.unit.toLowerCase().includes(search?.toLowerCase())
  );
  return (
    <div className="flex gap-4 mt-4 flex-col">
      {proofModal && (
        <ModalLayout image={true}>
          {/* <div className="w-full h-full"> */}
          <img src={proofModal} className="h-full w-full" />
          <button
            onClick={() => setProofModal(null)}
            className="w-full rounded-md px-4 p-2 mt-4  bg-zinc-900 text-white"
          >
            Close
          </button>
          {/* </div> */}
        </ModalLayout>
      )}
      {imageModal && (
        <ModalLayout image={true}>
          <div className="flex gap-4 w-full h-full flex-col p-10">
            <div className="items-center justify-center gap-4 flex flex-col">
              <p className="font-semibold text-2xl">Transaction ID#</p>{" "}
              <p>{imageModal._id}</p>
              <p className="font-semibold">Amount Paid:</p>
              <p className="font-semibold text-3xl">₱{imageModal?.amount}</p>
            </div>
            <p>
              <b>Payment Method:</b> {imageModal?.paymentmode}
            </p>
            <p>
              <b>Payment Date:</b>{" "}
              {moment(imageModal?.paymentdate).format("MMM DD, YYYY")}
            </p>
            {imageModal.proofofpayment && (
              <img
                src={imageModal.proofofpayment}
                className="h-80 object-contain"
              />
            )}
            <button
              onClick={() => setImageModal(null)}
              className="w-full rounded-md px-4 p-2 mt-4  bg-zinc-900 text-white"
            >
              Close
            </button>
          </div>
        </ModalLayout>
      )}
      {tab != 2 && <p className="text-xl">Search History Date</p>}
      <p className="text-xl">
        Tenant Name:{" "}
        {receiver
          ? `${receiver.firstname} ${receiver.middlename} ${receiver.lastname} - UNIT ${receiver.unit}`
          : ""}
      </p>
      <div className="flex gap-4">
        {tab != 2 && (
          <>
            <div className="w-full flex flex-col">
              <label htmlFor="from">From</label>
              <input
                type="date"
                id="from"
                onChange={(e) => {
                  setFrom(e.target.value);
                }}
                value={from ? moment(from).format("YYYY-MM-DD") : "yyyy-MM-DD"}
                className="px-4 p-2 rounded-md border border-slate-200"
              />
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="to">To</label>
              <input
                type="date"
                id="to"
                // value={to && to}
                onChange={(e) => {
                  setTo(e.target.value);
                }}
                value={to ? moment(to).format("YYYY-MM-DD") : "yyyy-MM-DD"}
                className="px-4 p-2 rounded-md border border-slate-200"
              />
            </div>
          </>
        )}
        <div
          // onBlur={() => setSearch(false)}
          className="w-full flex flex-col relative"
        >
          <label htmlFor="unit">Search Unit</label>
          <input
            id="unit"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="px-4 p-2 rounded-md border border-slate-200"
            placeholder="Choose a Tenant"
          />
        </div>
      </div>
      {tab == 2 && (
        <>
          <div className="flex flex-row gap-4">
            <div
              onClick={() => {
                // reload();
                setTypeofutility("Electrical");
              }}
              className={`${
                typeofutility == "Electrical" && "border-zinc-500 "
              } flex flex-row gap-4 items-center cursor-pointer border-2 border-white p-4 rounded-md bg-yellow-500 text-lg text-white`}
            >
              <ThunderSvg />
              Electrical
            </div>
            <div
              onClick={() => {
                // reload();
                setTypeofutility("Water");
              }}
              className={`${
                typeofutility == "Water" && "border-zinc-500 "
              } flex flex-row gap-4 items-center cursor-pointer border-2 border-white p-4 rounded-md bg-blue-500 text-lg text-white`}
            >
              <DropletSvg />
              Water
            </div>
          </div>
        </>
      )}
      {search?.length > 0 && (
        <>
          <p className="font-semibold ">Search results: </p>
          <div className=" w-full border bg-white max-h-40 overflow-y-auto">
            {unitsFiltered?.map((item, index) => (
              <p
                key={index}
                onClick={() => setReceiver(item)}
                value={index}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-200 hover:text-black ${
                  receiver?.unit == item.unit && "text-white bg-blue-500 "
                }"`}
              >
                {`${item.firstname} ${item.middlename} ${item.lastname} - UNIT ${item.unit}`}
              </p>
            ))}
          </div>
        </>
      )}
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-900 text-white text-center">
            {headers[tab].map((item, index) => (
              <td key={index} className="capitalize p-2 px-4">
                {item}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            newSlice?.map((item, index) => (
              <tr key={index} className="border">
                {headers[tab]?.map((keys, i) => (
                  <td
                    key={i}
                    className={`capitalize p-2 px-4 ${
                      keys == "amount" ? "text-right" : "text-center"
                    }`}
                  >
                    {keys == "payment date" ||
                    keys == "rent started" ||
                    // keys == "month coverage" ||
                    keys == "date of payment" ||
                    keys == "date of coverage" ? (
                      `${moment(item[keys.replaceAll(" ", "")]).format(
                        "MMM DD, YYYY"
                      )}`
                    ) : keys == "receipt" ? (
                      <>
                        {/* {item["receipt"] && ( */}
                        <button
                          onClick={() => setImageModal(item)}
                          className="my-2 font-semibold text-sm p-2 text-white bg-zinc-900 rounded-md"
                        >
                          View Receipt
                        </button>
                        {/* )} */}
                      </>
                    ) : keys == "proof of payment" ? (
                      <button
                        onClick={() => setProofModal(item["proofofpayment"])}
                        className="my-2 font-semibold text-sm p-2 text-white bg-violet-500 rounded-md"
                      >
                        Preview
                      </button>
                    ) : keys == "amount" ? (
                      `₱ ${parseFloat(item[keys.replaceAll(" ", "")])}`
                    ) : (
                      item[keys.replaceAll(" ", "")]
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="border text-center" colSpan={9}>
                {isLoading ? "Fetching Data..." : "No data"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex gap-1 my-5">
        {Array.from(
          { length: Math.ceil(data?.length / MAX) },
          (_, i) => i + 1
        ).map((item, index) => (
          <button
            onClick={() => paginationHandler(item)}
            className={`p-1 px-4 rounded-md ${
              page == item
                ? " text-white bg-zinc-900 "
                : " text-zinc-900 bg-white "
            } `}
            key={index}
          >
            {item}
          </button>
        ))}
      </div>
      {tab != 2 && (
        <>
          {totalRef.current > 0 && (
            <>
              <p>Total: {totalRef.current}</p>
              <button className=" hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
                Print
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportTable;
