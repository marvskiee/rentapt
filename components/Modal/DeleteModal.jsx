import React from "react";
import ModalLayout from "../Layout/ModalLayout";

const DeleteModal = ({ cancel, unit, handler }) => {
  return (
    <ModalLayout>
      <div className="flex flex-col gap-4">
        <p className="p-2 text-xl">
          Do you want to update the account status to{" "}
          <b className="capitalize">
            "{!unit[0].status ? "Active" : "Inactive"}"
          </b>
          ?
        </p>
        <div className="flex gap-4 justify-end">
          <button
            className="p-2 px-4 rounded-md bg-blue-500 text-white"
            onClick={() => {
              handler({
                status: !unit[0].status,
                availability: unit[0].status ? "vaccant" : "occupied",
              });
              cancel(false);
            }}
          >
            Confirm
          </button>
          <button
            className="p-2 px-4 rounded-md bg-slate-500 text-white"
            onClick={() => cancel(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default DeleteModal;
