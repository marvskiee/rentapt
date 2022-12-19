import React, { useRef, useState } from "react";
import { Alert, SectionLayout } from "../../components";
import { createRepairRequest } from "../../services/repair.services";
import { useAppContext } from "../../context/AppContext";
import { adminContact } from "../../services/config.services";
import { createRequest } from "../../services/request.services";

//firebase
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../services/firebase";
const RepairRequest = () => {
  const { state } = useAppContext();
  const [proofImage, setProofImage] = useState("");
  const imageKeyRef = useRef([0]);
  const setProofUrlRef = useRef();

  const concernRef = useRef();
  const [success, setSuccess] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();

  const uploadProof = () => {
    setIsLoading(true);

    if (proofImage?.file == null) {
      setIsLoading(false);
      return;
    }
    const imageRef = ref(storage, `images/${proofImage.file.name + v4()}`);
    uploadBytes(imageRef, proofImage.file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setProofUrlRef.current = url;
          sendHandler();
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const clearForm = () => {
    concernRef.current.value = null;
  };
  const verifyHandler = () => {
    let tempErrors = {};
    if (!concernRef.current?.value) {
      tempErrors = {
        concernError: "Concern is required.",
      };
    }
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
  const sendHandler = async () => {
    const sentBy = ` / Requested By ${state?.user?.firstname} ${state?.user?.lastname} in unit ${state?.user?.unit}`;
    const requestData = {
      image: setProofUrlRef.current,
      sms: concernRef.current?.value + sentBy,
    };
    console.log(requestData);
    setSuccess(-1);
    const newData = {
      message: concernRef.current?.value + sentBy,
      mobile_number: adminContact,
    };
    console.log(newData);
    if (verifyHandler()) {
      const res = await createRepairRequest(newData);
      if (res.success) {
        clearForm();
        setSuccess(5);
        let ran1 = Math.random().toString(36);

        imageKeyRef.current = [ran1];
      } else {
        setSuccess(0);
      }
      await createRequest(requestData);
    }
    setIsLoading(false);
  };
  const fields = [
    {
      label: "Proof of Damage",
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
      <SectionLayout title="Repair Request">
        <div className="flex gap-4 flex-col">
          <Alert status={success} />
          {errors && (
            <span className="text-rose-500">{errors?.concernError}</span>
          )}
          <label className="text-lg" htmlFor="concern">
            Concern
          </label>
          <textarea
            ref={concernRef}
            defaultValue={concernRef.current?.value}
            required
            rows={10}
            id="concern"
            className="px-4 p-2 rounded-md border border-slate-200"
          ></textarea>
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
          {isLoading ? (
            <span className="text-center hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
              Sending...
            </span>
          ) : (
            <button
              onClick={uploadProof}
              className=" hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white"
            >
              Send
            </button>
          )}
        </div>
      </SectionLayout>
    </div>
  );
};

export default RepairRequest;
