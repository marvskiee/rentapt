import React, { useRef, useState } from "react";
import {
  Alert,
  LogLayout,
  PaymentModal,
  SectionLayout,
} from "../../components";
import {
  createRentalBill,
  getRentalLogs,
} from "../../services/rental.services";
import { useAppContext } from "../../context/AppContext";
import moment from "moment";
//firebase
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../services/firebase";
import { useEffect } from "react";

const RentalPayment = () => {
  const { state } = useAppContext();
  const [paymentModal, setPaymentModal] = useState(false);
  const [logs, setLogs] = useState([]);

  const paymentRef = useRef();
  const monthRef = useRef();
  const paymentMethodRef = useRef();
  const [proofImage, setProofImage] = useState("");

  const setProofUrlRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState(-1);
  const imageKeyRef = useRef([0]);
  const mountedRef = useRef();
  const rentalBillCountRef = useRef(0);
  useEffect(() => {
    // console.log(localStorage.getItem("access_id"));
    const load = async () => {
      const res = await getRentalLogs(state?.user?._id);
      if (res.success) {
        const count = res.data.filter((r) => r.status == "approved");
        console.log("c", count.length);
        const started = moment(state?.user?.startofrent).month();
        const now = moment().month();
        rentalBillCountRef.current = now - started - count.length;
        console.log(now - started - count.length);
        setLogs(res.data);
      }
    };
    load();
  }, [state?.user?._id]);
  const postSaveHandler = async () => {
    const newData = {
      unit: state?.user?.unit,
      tenantid: state?.user?._id,
      amount: state?.user?.rentamount,
      rentstarted: state?.user?.startofrent,
      paymentdate: moment().format("yyyy-MM-DD hh:mm:ss"),
      // monthcoverage: monthRef.current.value,
      proofofpayment: setProofUrlRef.current,
      paymentmode: paymentMethodRef.current?.value || "Gcash",
      status: "pending",
    };
    console.log(newData);
    const res = await createRentalBill(newData);
    if (res.success) {
      let ran1 = Math.random().toString(36);
      imageKeyRef.current = [ran1];
      clearForm();
      setSuccess(5);
    } else {
      deleteProof();
      console.log(res.errors);
      setSuccess(0);
    }
    setIsLoading(false);
  };
  const deleteProof = () => {
    let pictureRef = ref(storage, setProofUrlRef.current);
    deleteObject(pictureRef)
      .then(() => {
        console.log("Passed 1");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const uploadProof = () => {
    if (proofImage?.file == null) {
      setIsLoading(false);
      return;
    }
    const imageRef = ref(storage, `images/${proofImage.file.name + v4()}`);
    uploadBytes(imageRef, proofImage.file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setProofUrlRef.current = url;
          postSaveHandler();
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const clearForm = () => {
    // paymentRef.current.value = null;
    // monthRef.current.value = null;
    setProofImage(null);
  };
  const saveHandler = () => {
    setSuccess(-1);
    setIsLoading(true);
    if (rentalBillCountRef?.current * state?.user?.rentamount == 0) {
      setSuccess(12);
      setIsLoading(false);
      return;
    }
    if (verifyHandler()) {
      uploadProof();
      console.log("pwede");
    } else {
      setIsLoading(false);
    }
  };
  const verifyHandler = () => {
    let tempErrors = {};
    if (paymentRef.current?.value.length <= 0) {
      tempErrors = {
        ...tempErrors,
        paymentError: "is required.",
      };
    }
    // if (monthRef.current?.value.length < 1) {
    //   tempErrors = {
    //     ...tempErrors,
    //     monthError: "is required.",
    //   };
    // }
    if (proofImage?.file?.size > 3000000 || !proofImage) {
      tempErrors = {
        ...tempErrors,
        proofError: "is required and must be less than 3mb only.",
      };
    }
    setErrors(tempErrors);
    const numberOfErrors = Object.keys(tempErrors);
    console.log(numberOfErrors);
    if (numberOfErrors.length > 0) {
      return false;
    }
    return true;
  };
  const fields = [
    // {
    //   label: "Date of Payment",
    //   ref: paymentRef,
    //   type: "date",
    //   error: errors?.paymentError,
    //   defaultValue: moment().format("mm-dd-yyy"),
    // },
    // {
    //   label: "Month Coverage",
    //   ref: monthRef,
    //   type: "date",
    //   error: errors?.monthError,
    //   defaultValue: monthRef.current?.value,
    // },
    {
      label: "Proof of Payment",
      type: "file",
      error: errors?.proofError,
      changehandler: (e) => {
        try {
          setProofImage({
            url: URL?.createObjectURL(e.target?.files[0]),
            file: e.target?.files[0],
          });
        } catch (e) {
          console.log(e);
        }
      },
      key: imageKeyRef?.current[0],
    },
  ];
  return (
    <div>
      {paymentModal && <PaymentModal close={setPaymentModal} />}
      <SectionLayout title="Rental Payment">
        <div className="flex flex-col xl:flex-row gap-4 w-full">
          <div className="flex flex-col gap-4 w-full">
            <Alert status={success} />
            <div className="p-2 px-4 bg-gradient-to-r rounded-md from-cyan-500 to-blue-500 flex items-center justify-between">
              <p className="text-white">
                To make a payment please refer to our payment qr code
              </p>
              <button
                onClick={() => setPaymentModal(true)}
                className="p-2 px-4 rounded-md  bg-zinc-900 text-white"
              >
                QR CODE
              </button>
            </div>
            <div
              className={`flex text-white rounded-md justify-between bg-gradient-to-r ${
                rentalBillCountRef?.current * state?.user?.rentamount > 0
                  ? "from-red-400 to-rose-500"
                  : rentalBillCountRef?.current * state?.user?.rentamount == 0
                  ? "from-emerald-500 to-green-500"
                  : "from-zinc-500 to-slate-500"
              } p-4`}
            >
              <label className="font-semibold text-2xl">
                Your Rent Balance
              </label>
              <p className="font-semibold text-4xl">
                ₱{rentalBillCountRef?.current * state?.user?.rentamount || 0}
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <label className="text-lg">Rent Started</label>
              <p className="cursor-not-allowed px-4 p-2 rounded-md border border-slate-200">
                {moment(state?.user?.startofrent).format("MMM DD, YYYY")}
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <label className="text-lg">Amount</label>
              <p className="cursor-not-allowed px-4 p-2 rounded-md border border-slate-200">
                {state?.user?.rentamount || 0}
              </p>
            </div>
            {fields.map(
              (
                { label, ref, type, error, changehandler, defaultValue, key },
                index
              ) => (
                <div key={index} className="flex flex-col justify-end">
                  {error && (
                    <span className="text-rose-500">
                      {label} {error}
                    </span>
                  )}
                  <label
                    htmlFor={label.toLowerCase().replace(" ", "")}
                    className="text-lg"
                  >
                    {label}
                  </label>
                  {type == "file" ? (
                    <input
                      key={key}
                      id={label.toLowerCase().replace(" ", "")}
                      type={type}
                      className="px-4 p-2 rounded-md border border-slate-200"
                      onChange={changehandler}
                      accept="image/*"
                    />
                  ) : (
                    <input
                      defaultValue={defaultValue}
                      id={label.toLowerCase().replace(" ", "")}
                      ref={ref}
                      type={type}
                      className="px-4 p-2 rounded-md border border-slate-200"
                    />
                  )}
                </div>
              )
            )}
            <label htmlFor="paymentMethod" className="text-lg">
              Payment Method
            </label>
            <select
              ref={paymentMethodRef}
              id="paymentMethod"
              className="px-4 p-2 rounded-md border border-slate-200"
            >
              <option value="Gcash">Gcash</option>
              <option value="Paymaya">Paymaya</option>
            </select>
            {isLoading ? (
              <span className=" hover:border-zinc-400 border-2 text-center border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
                Saving...
              </span>
            ) : (
              <button
                onClick={saveHandler}
                className=" hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white"
              >
                Save
              </button>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full">
            <LogLayout data={logs} />
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};

export default RentalPayment;
