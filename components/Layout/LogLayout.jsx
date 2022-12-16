import React from "react";
import moment from "moment";
import { useState, useRef } from "react";
import ModalLayout from "./ModalLayout";
import { useEffect } from "react";
const LogLayout = ({ data }) => {
  const [imageModal, setImageModal] = useState(null);
  const [page, setPage] = useState(1);
  const [newSlice, setNewSlice] = useState(null);
  const MAX = 4;
  useEffect(() => {
    setNewSlice(data?.slice(0, MAX));
  }, [data]);
  const paginationHandler = (item) => {
    setPage(item);
    setNewSlice(data.slice(item * MAX - MAX, item * MAX));
  };

  return (
    <div className="">
      <p className="font-semibold text-2xl my-10 md:my-2 px-4 gap-5">
        Activity Logs
      </p>
      <div className="h-screen max-h-logs">
        {data?.length > 0 ? (
          newSlice &&
          newSlice?.map(
            (
              { status, paymentdate, amount, paymentmode, _id, proofofpayment },
              index
            ) => (
              <div
                className="border-b-2 p-4 flex items-start justify-between w-full"
                key={index}
              >
                <div>
                  <p className="text-xl font-semibold">{paymentmode}</p>
                  <p>₱ {parseFloat(amount)}</p>
                  {status == "approved" && (
                    <button
                      onClick={() =>
                        setImageModal({
                          paymentmode,
                          amount,
                          status,
                          paymentdate,
                          proofofpayment,
                          _id,
                        })
                      }
                      className="my-2 font-semibold text-sm p-2 text-white bg-zinc-900 rounded-md"
                    >
                      View Receipt
                    </button>
                  )}
                </div>
                <div>
                  <p>{status.toUpperCase()}</p>
                  <p>{moment(paymentdate).format("MMM DD, YYYY")}</p>
                </div>
              </div>
            )
          )
        ) : (
          <>
            <div className="p-4 ">Your logs is clean {":>"}</div>
          </>
        )}
      </div>
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
      {/* <div className="mb-20 flex w-full flex-row items-center justify-between">
        <button
          onClick={clickPrevious}
          className="rounded-md border bg-gray-600 py-2 px-5 text-sm text-white"
        >
          Previous
        </button>
        <p>
          <b>{pageNumber + 1}</b>
        </p>
        <button
          onClick={clickNext}
          className="rounded-md border bg-gray-600 py-2 px-5 text-sm text-white"
        >
          Next
        </button>
      </div> */}
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
    </div>
  );
};

export default LogLayout;
