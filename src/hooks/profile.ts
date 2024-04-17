import { collection, getDocs, setDoc, doc } from "@firebase/firestore";
import { useMutation, useQuery } from "react-query";
import { firestoreDB } from "./config";
import { notification } from "antd";

export const useGetProfile = (successAction?: any) => {
  const handleGet = async () => await getDocs(collection(firestoreDB, "profile"))
  .then((data: any) => Promise.resolve(data?.docs?.map((doc: any) => ({...doc.data(), id:doc.id }))?.[0]))
  return useQuery(["key:get_profile"], () => handleGet(), {
    onSuccess: (res: any) => successAction?.(res),
    onError: (err: any) => notification.error({
      description: err?.message || "Something went wrong.",
      message: "Error!",
    })
  }
)};

export const usePutProfile = (successAction?: any) => {
  const handlePut = async (payload: any) => await setDoc(doc(firestoreDB, "profile", "user"), payload)
  return useMutation((payload: any) => handlePut(payload), {
    onSuccess: (res: any) => {
      successAction?.(res)
      notification.success({
        message: "Success!",
        description: res?.message || "Action successful."
      })
    },
    onError: (err: any) => notification.error({
      message: "Error!",
      description: err?.message || "Something went wrong."
    })
  }
)};