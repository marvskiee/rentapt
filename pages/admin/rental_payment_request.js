import React, { useState, useRef, useEffect } from "react";
import {
  createRentalBill,
  differenceInMonths,
  getRentalLogs,
  getRentalRequest,
  updateRentalStatus,
} from "../../services/rental.services";
import moment from "moment";
import { Alert, ModalLayout, SectionLayout } from "../../components";
import { CheckSvg, DeclineSvg } from "../../components/Svg";
import {
  getAllUsers,
  getTenant,
  updateUser,
} from "../../services/user.services";

const RentalPayment = () => {
  const [imageModal, setImageModal] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(-1);
  // const [error, setError] = useState(null);
  const searchListRef = useRef();

  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  // const [units, setUnits] = useState();
  const [action, setAction] = useState({ data: null, mode: null });
  const [newSlice, setNewSlice] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const MAX = 10;

  const rentalBillCountRef = useRef(0);

  useEffect(() => {
    setIsLoading(true);
    fetchRental();
    usersList();
  }, []);
  const usersList = async () => {
    const res = await getAllUsers();
    if (res.success) {
      searchListRef.current = res.data;

      // setUnits(res.data);
    }
  };
  const paginationHandler = (item) => {
    setPage(item);
    setNewSlice(data.slice(item * MAX - MAX, item * MAX));
  };

  const headers = [
    "unit",
    "payment date",
    // "month coverage",
    "amount",
    "rent started",
    "proof of payment",
  ];
  const fetchRental = async () => {
    const res = await getRentalRequest();
    if (res.success) {
      setData(res.data);
      setNewSlice(res.data?.slice(page * MAX - MAX, page * MAX));
    }
    setIsLoading(false);
  };
  const postSaveHandler = async () => {
    const newData = {
      unit: receiver.unit,
      tenantid: receiver._id,
      amount: receiver.rentamount,
      rentstarted: receiver?.startofrent,
      // paymentdate: paymentRef.current.value,
      // monthcoverage: monthRef.current.value,
      // proofofpayment: "Cash",
      paymentmode: "Cash",
      status: "approved",
    };
    console.log(newData);

    const res = await createRentalBill(newData);
    if (res.success) {
      let ran1 = Math.random().toString(36);
      // imageKeyRef.current = [ran1];
      // clearForm();
      setSuccess(11);
    } else {
      // deleteProof();
      console.log(res.errors);
      setSuccess(0);
    }
    setReceiptModal(null);
    setReceiver(null);
    setSearch("");
    // setIsLoading(false);
  };
  const declinedHandler = async () => {
    setSuccess(-1);
    setIsLoading(true);
    setAction({ data: null, mode: null });
    const res = await updateRentalStatus(action.data._id, {
      status: action.mode + "d",
    });
    if (res.success) {
      await fetchRental();
      setSuccess(8);
    } else {
      setSuccess(6);
    }
    setIsLoading(false);
  };

  const approvedHandler = async () => {
    setSuccess(-1);
    setIsLoading(true);
    setAction({ data: null, mode: null });
    console.log(action.data.tenantid);
    // setError("The amount balance is less than");
    const res1 = await getRentalLogs(action.data.tenantid);

    if (res1.success) {
      const count = res1.data.filter((r) => r.status == "approved");
      const now = moment().clone().format("YYYY-MM-DD");
      const id = await getTenant(action.data.tenantid);
      console.log(id);
      const started = moment(id.data?.startofrent).format("YYYY-MM-DD");
      console.log(differenceInMonths(new Date(now), new Date(started)));
      if (
        differenceInMonths(new Date(now), new Date(started)) - count.length ==
        0
      ) {
        console.log(action.data?.rentstarted);
        setSuccess(9);
        return;
      }
      let balance = res1.data?.tenantbalance - action.data.amount;
      if (balance < 0) {
        setSuccess(10);
        return;
      }
      const newData = {
        tenantbalance: await balanceHandler(),
      };
      console.log(newData);
      const res2 = await updateUser(action.data.tenantid, newData);
      if (res2.success) {
        const res = await updateRentalStatus(action.data._id, {
          status: action.mode + "d",
        });
        if (res.success) {
          await fetchRental();
          setSuccess(7);
        } else {
          setSuccess(6);
        }
      } else {
        setSuccess(6);
      }
    } else {
      setSuccess(6);
    }
    setIsLoading(false);
  };
  const balanceHandler = async () => {
    let res = null;
    let count = [];
    res = await getRentalLogs(receiver?._id || action.data.tenantid);
    count = res.data.filter((r) => r.status == "approved");
    console.log(count);
    // if (res.success) {
    // console.log("c", count.length);
    const id = await getTenant(receiver?._id || action.data.tenantid);
    console.log(id);
    const started = moment(
      receiver?.startofrent || id.data?.startofrent
    ).format("YYYY-MM-DD");
    const now = moment().clone().format("YYYY-MM-DD");
    rentalBillCountRef.current =
      differenceInMonths(new Date(now), new Date(started)) - count.length;
    console.log(started, now);
    console.log(action.data);
    return (
      (rentalBillCountRef.current - 1) *
      parseFloat(receiver?.rentamount || action.data.amount)
    );
  };
  const createHandler = async () => {
    // console.log(receiver);
    const res1 = await getRentalLogs(receiver._id);
    console.log(res1);
    if (res1.success) {
      const count = res1.data.filter((r) => r.status == "approved");

      const started = moment(receiver?.startofrent).month();
      const now = moment().month();
      console.log(count.length);
      console.log(now - started);
      if (now - started - count.length == 0) {
        setSuccess(12);
        setReceiptModal(null);
        setReceiver(null);
        setSearch("");
        return;
      }
      const newData = {
        tenantbalance: await balanceHandler(),
      };
      console.log(receiver.rentamount);
      await updateUser(receiver._id, newData);

      postSaveHandler();
    }
  };
  const unitsFiltered = searchListRef.current?.filter(
    (u) =>
      u.firstname.toLowerCase().includes(search?.toLowerCase()) ||
      u.lastname.toLowerCase().includes(search?.toLowerCase()) ||
      u.unit.toLowerCase().includes(search?.toLowerCase())
  );
  return (
    <div>
      <SectionLayout title="Rental Payment Request">
        <button
          onClick={() => setReceiptModal(true)}
          className="bg-violet-500 px-4 p-2 mb-4 rounded-md text-white"
        >
          Create Rental Receipt
        </button>
        {receiptModal && (
          <ModalLayout image={true}>
            {/* <div className="w-full h-full"> */}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="px-4 p-2 rounded-md border border-slate-200 w-full "
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search for tenant"
              />
              <p>
                <b>Selected Tenant: </b> <br />
                {receiver
                  ? `${receiver.firstname} ${receiver.middlename} ${receiver.lastname} - UNIT ${receiver.unit}`
                  : ""}
              </p>
              {search?.length > 0 && (
                <div className=" w-full border bg-white max-h-40 overflow-y-auto">
                  {unitsFiltered?.map((item, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        setReceiver(item);
                        setSearch("");
                      }}
                      value={index}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-200 hover:text-black ${
                        receiver?.unit == item.unit && "text-white bg-blue-500 "
                      }"`}
                    >
                      {`${item.firstname} ${item.middlename} ${item.lastname} - UNIT ${item.unit}`}
                    </p>
                  ))}
                </div>
              )}
              {receiver && (
                <div>
                  <p>
                    Rent Amount:
                    {receiver.rentamount}
                  </p>
                  <p>Payment Mode: Cash</p>
                  <p>Payment Date: {moment().format("MMM DD, YYYY")}</p>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setReceiptModal(null);
                  setSearch("");
                  setReceiver(null);
                }}
                className="w-full rounded-md px-4 p-2 mt-4  bg-zinc-900 text-white"
              >
                Close
              </button>
              {receiver && (
                <button
                  onClick={createHandler}
                  className="w-full rounded-md px-4 p-2 mt-4  bg-blue-500 text-white"
                >
                  Create
                </button>
              )}
            </div>
            {/* </div> */}
          </ModalLayout>
        )}
        {action.mode && (
          <ModalLayout image={true}>
            <div className="flex gap-4 flex-col">
              <p className="text-lg">
                Are you sure you want to {action.mode} this request
              </p>
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() =>
                    action.mode != "decline"
                      ? approvedHandler()
                      : declinedHandler()
                  }
                  className="px-4 p-2 rounded-md bg-blue-500 text-white"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setAction({ data: null, mode: null })}
                  className="px-4 p-2 rounded-md bg-slate-500 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </ModalLayout>
        )}
        {imageModal && (
          <ModalLayout image={true}>
            {/* <div className="w-full h-full"> */}
            <img src={imageModal} className="h-full w-full" />
            <button
              onClick={() => setImageModal(null)}
              className="w-full rounded-md px-4 p-2 mt-4  bg-zinc-900 text-white"
            >
              Close
            </button>
            {/* </div> */}
          </ModalLayout>
        )}
        <Alert status={success} />

        <table className="w-full mt-4">
          <thead>
            <tr className="bg-zinc-900 text-white text-center">
              {headers.map((item, index) => (
                <td key={index} className="capitalize p-2 px-4">
                  {item}
                </td>
              ))}
              <td className="text-center">Decline</td>
              <td className="text-center">Approve</td>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              newSlice?.map((item, index) => (
                <tr key={index} className="border">
                  {headers?.map((keys, i) => (
                    <td
                      key={i}
                      className={`capitalize p-2 px-4 ${
                        keys == "amount" ? "text-right" : "text-center"
                      }`}
                    >
                      {keys == "payment date" ||
                      keys == "rent started" ||
                      keys == "month coverage" ||
                      keys == "date of payment" ||
                      keys == "date of coverage" ? (
                        `${moment(item[keys.replaceAll(" ", "")]).format(
                          "MMM DD, YYYY"
                        )}`
                      ) : keys == "proof of payment" ? (
                        <button
                          className="p-2 px-4 rounded-md bg-violet-500 text-white"
                          onClick={() => setImageModal(item["proofofpayment"])}
                        >
                          Preview
                        </button>
                      ) : keys == "amount" ? (
                        `₱${parseInt(item[keys.replaceAll(" ", "")]) * 1}`
                      ) : (
                        item[keys.replaceAll(" ", "")]
                      )}
                    </td>
                  ))}
                  <td className="text-center">
                    <button
                      onClick={() => setAction({ data: item, mode: "decline" })}
                      className="p-2 px-4 rounded-md  bg-rose-500 m-2"
                    >
                      <DeclineSvg />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => setAction({ data: item, mode: "approve" })}
                      className="p-2 px-4 rounded-md  bg-blue-500 m-2"
                    >
                      <CheckSvg />
                    </button>
                  </td>
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
      </SectionLayout>
    </div>
  );
};

export default RentalPayment;
