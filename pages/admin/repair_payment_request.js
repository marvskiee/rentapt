import React, { useState, useRef, useEffect } from "react";
import {
  createRepairBill,
  getRepairRequest,
  updateRepairStatus,
} from "../../services/repair.services";
import moment from "moment";
import { Alert, ModalLayout, SectionLayout } from "../../components";
import { CheckSvg, DeclineSvg } from "../../components/Svg";
import {
  getAllUsers,
  getTenant,
  updateUser,
} from "../../services/user.services";

const RepairPayment = () => {
  const [imageModal, setImageModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [receiptModal, setReceiptModal] = useState(null);
  const [success, setSuccess] = useState(-1);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  const [action, setAction] = useState({ data: null, mode: null });
  const [units, setUnits] = useState();
  const [receiver, setReceiver] = useState(null);
  const [search, setSearch] = useState();
  const [page, setPage] = useState(1);
  const searchListRef = useRef();
  const repairAmountRef = useRef();
  const descriptionRef = useRef();
  const mountedRef = useRef();
  // const [action, setAction] = useState({ data: null, mode: null });
  const [newSlice, setNewSlice] = useState(null);
  const MAX = 10;
  useEffect(() => {
    setIsLoading(true);
    fetchRepair();
    usersList();
  }, []);
  const paginationHandler = (item) => {
    setPage(item);
    setNewSlice(data.slice(item * MAX - MAX, item * MAX));
  };
  const usersList = async () => {
    const res = await getAllUsers();
    if (res.success) {
      searchListRef.current = res.data;

      // setUnits(res.data);
    }
  };
  const headers = ["unit", "payment date", "amount", "proof of payment"];
  const fetchRepair = async () => {
    const res = await getRepairRequest();
    if (res.success) {
      setData(res.data);
      setNewSlice(res.data?.slice(page * MAX - MAX, page * MAX));
    }
    setIsLoading(false);
  };
  const declinedHandler = async () => {
    setSuccess(-1);
    setIsLoading(true);
    setAction({ data: null, mode: null });
    const res = await updateRepairStatus(action.data._id, {
      status: action.mode + "d",
    });
    if (res.success) {
      await fetchRepair();
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
    console.log(action);
    // setError("The amount balance is less than");
    const res1 = await getTenant(action.data._id);
    if (res1.success) {
      const res = await updateRepairStatus(action.data._id, {
        status: action.mode + "d",
      });
      if (res.success) {
        await fetchRepair();
        setSuccess(7);
      } else {
        setSuccess(6);
      }
    } else {
      setSuccess(6);
    }
    setIsLoading(false);
  };
  const postSaveHandler = async () => {
    const newData = {
      unit: receiver.unit,
      tenantid: receiver._id,
      amount: repairAmountRef?.current?.value,
      description: descriptionRef.current?.value,
      // rentstarted: receiver?.startofrent,
      // paymentdate: paymentRef.current.value,
      // monthcoverage: monthRef.current.value,
      // proofofpayment: "Cash",
      paymentmode: "Cash",
      status: "approved",
    };
    console.log(newData);
    const res = await createRepairBill(newData);
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
  const createHandler = (e) => {
    e.preventDefault();
    // console.log(receiver);
    postSaveHandler();
  };
  const unitsFiltered = searchListRef.current?.filter(
    (u) =>
      u.firstname.toLowerCase().includes(search?.toLowerCase()) ||
      u.lastname.toLowerCase().includes(search?.toLowerCase()) ||
      u.unit.toLowerCase().includes(search?.toLowerCase())
  );
  return (
    <div>
      <SectionLayout title="Repair Payment Request">
        <button
          onClick={() => setReceiptModal(true)}
          className="bg-violet-500 px-4 p-2 mb-4 rounded-md text-white"
        >
          Create Repair Receipt
        </button>
        {receiptModal && (
          <ModalLayout image={true}>
            {/* <div className="w-full h-full"> */}
            <form onSubmit={createHandler}>
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
                          receiver?.unit == item.unit &&
                          "text-white bg-blue-500 "
                        }"`}
                      >
                        {`${item.firstname} ${item.middlename} ${item.lastname} - UNIT ${item.unit}`}
                      </p>
                    ))}
                  </div>
                )}
                {receiver && (
                  <div>
                    <label>Repair Amount:</label>
                    <input
                      min={1}
                      max={9999}
                      type="number"
                      className="px-4 p-2 rounded-md border border-slate-200 w-full "
                      ref={repairAmountRef}
                      placeholder="0"
                      required
                    />
                    <label>Repair Description:</label>

                    <textarea
                      className="px-4 p-2 rounded-md border border-slate-200 w-full "
                      ref={descriptionRef}
                      // placeholder="0"
                      required
                    />
                    <p>Payment Mode: Cash</p>
                    <p>Payment Date: {moment().format("MMM DD, YYYY")}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
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
                    type="submit"
                    className="w-full rounded-md px-4 p-2 mt-4  bg-blue-500 text-white"
                  >
                    Create
                  </button>
                )}
              </div>
            </form>

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

export default RepairPayment;
