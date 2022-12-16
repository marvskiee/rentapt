import React, { useState, useEffect, useRef } from "react";
import {
  DeleteModal,
  SectionLayout,
  Alert,
  UpdateModal,
} from "../../components";
import { DeleteSvg, EditSvg, StatusSvg } from "../../components/Svg";
import {
  checkUnit,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../../services/user.services";

const AccountMaintenance = () => {
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const selectedRef = useRef();
  const selectedUnitRef = useRef();

  const [success, setSuccess] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [newSlice, setNewSlice] = useState(null);
  const MAX = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    reloadData();
  }, []);
  const reloadData = () => {
    const load = async () => {
      setIsLoading(true);
      const res = await getAllUsers();
      if (res.success) {
        setData(res.data);
        setNewSlice(res.data?.slice(page * MAX - MAX, page * MAX));
      }
      setIsLoading(false);
    };
    load();
  };
  const cancelHandler = () => {
    // reloadData();
    setUpdateModal(false);
  };
  const headers = [
    "unit",
    "availability",
    "fullname",
    "contact",
    "advance payment",
    "total deposit",
    "tenant balance",
  ];
  const paginationHandler = (item) => {
    setPage(item);
    setNewSlice(data.slice(item * MAX - MAX, item * MAX));
  };
  const moneySign = ["advance payment", "total deposit", "tenant balance"];
  const confirmHandler = async (newData) => {
    const tenantId = selectedRef.current;
    const tenantUnit = selectedUnitRef.current;
    console.log(tenantUnit);
    if (newData.status) {
      const checker = await checkUnit(tenantUnit);
      if (checker?.data.length > 0) {
        setSuccess(0);
        return;
      }
    }
    const res = await updateUser(tenantId, newData);
    if (res.success) {
      reloadData();
      setSuccess(2);
    } else {
      setSuccess(0);
    }
  };
  return (
    <div>
      {updateModal && (
        <UpdateModal
          cancel={cancelHandler}
          data={data}
          reload={reloadData}
          unit={data.filter((d) => d._id == selectedRef.current)}
        />
      )}
      {deleteModal && (
        <DeleteModal
          cancel={setDeleteModal}
          handler={confirmHandler}
          unit={data.filter((d) => d._id == selectedRef.current)}
        />
      )}

      <SectionLayout title="Account Maintenance">
        <div className="mb-4">
          <Alert status={success} />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900 text-white">
              {headers.map((item, index) => (
                <td key={index} className="capitalize p-2 px-4 text-center">
                  {item}
                </td>
              ))}
              <td className="text-center">Edit</td>
              <td className="text-center flex items-center flex-col">
                <div>Status</div>
                <div className="flex items-center gap-1">
                  <span className="flex w-2 h-2 aspect-square rounded-full bg-emerald-500">
                    {" "}
                  </span>
                  <p className="text-xs gap-2 text-center  w-full">Active</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="flex w-2 h-2 aspect-square rounded-full bg-rose-500">
                    {" "}
                  </span>
                  <p className="text-xs gap-2 text-center  w-full">Inactive</p>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              newSlice?.map((item, index) => (
                <tr key={index} className="border">
                  {headers?.map((keys, i) => (
                    <td
                      key={i}
                      className={`${
                        keys == "unit" ? "uppercase" : "capitalize"
                      } p-2 px-4 ${i > 2 ? "text-right" : "text-center"}`}
                    >
                      {keys == "fullname"
                        ? `${item.firstname} ${item.middlename} ${item.lastname}`
                        : keys == "contact"
                        ? `(+63)${item.contact}`
                        : moneySign.includes(keys)
                        ? `₱${item[keys.replace(" ", "")]}`
                        : item[keys.replace(" ", "")]}
                    </td>
                  ))}
                  <td className="text-center">
                    <button
                      onClick={() => {
                        selectedRef.current = item._id;
                        selectedUnitRef.current = item.unit;
                        setUpdateModal(true);
                      }}
                      className="p-2 px-4 rounded-md  bg-blue-500 m-2"
                    >
                      <EditSvg />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => {
                        selectedRef.current = item._id;
                        selectedUnitRef.current = item.unit;
                        setDeleteModal(true);
                      }}
                      className={`p-2 px-4 rounded-md  ${
                        item.status ? "bg-emerald-500" : "bg-rose-500 "
                      } m-2`}
                    >
                      <StatusSvg />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border text-center" colSpan={9}>
                  {isLoading ? "Fetching Data Please Wait..." : "No Data"}
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

export default AccountMaintenance;
