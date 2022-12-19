import React from "react";
import moment from "moment";
import { useState, useRef } from "react";
import ModalLayout from "./ModalLayout";
import { useEffect } from "react";
import { nFormat } from "../../services/money.services";
const RequestLayout = ({ data }) => {
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
        Request Logs
      </p>
      <div className="h-screen max-h-logs">
        {data?.length > 0 ? (
          newSlice &&
          newSlice?.map(({ sms, image, createdAt }, index) => (
            <div
              className="border-b-2 p-4 flex items-start justify-between w-full"
              key={index}
            >
              <div>
                <p className="text-sm">{sms}</p>
                <button
                  onClick={() =>
                    setImageModal({
                      image,
                    })
                  }
                  className="my-2 font-semibold text-sm p-2 text-white bg-zinc-900 rounded-md"
                >
                  View Image
                </button>
              </div>
              <div>
                <p>{moment(createdAt).format("MMM DD, YYYY")}</p>
              </div>
            </div>
          ))
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

      {imageModal && (
        <ModalLayout image={true}>
          <div className="flex gap-4 w-full h-full flex-col p-10">
            <img src={imageModal.image} className="h-80 object-contain" />
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

export default RequestLayout;
