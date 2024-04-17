import { addDoc, collection, getDocs, deleteDoc, setDoc, doc } from "@firebase/firestore";
import { useMutation, useQuery } from "react-query";
import { firestoreDB } from "./config";
import { notification } from "antd";

export const useGetAllStacks = () => {
  const handleGet = async () => await getDocs(collection(firestoreDB, "stacks"))
  .then((data: any) => Promise.resolve(data?.docs?.map((doc: any) => ({...doc.data(), id:doc.id }))))
  return useQuery(["key:get_all_stacks"], handleGet, {
  onError: (err: any) => notification.error({
    message: "Error!",
    description: err?.message || "Something went wrong."
  })
})};

export const usePostStack = (successAction?: any) => {
  const handlePost = async (payload: any) => await addDoc(collection(firestoreDB, "stacks"), payload)
  return useMutation((payload: any) => handlePost(payload), {
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
  })};

  export const usePutStack = (successAction?: any) => {
    const handlePost = async (payload: any) => await setDoc(doc(firestoreDB, "stacks", payload?.id), payload)
    return useMutation((payload: any) => handlePost(payload), {
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
    })};

    export const useDeleteStack = (successAction?: any) => {
      const handlePost = async (payload: any) => await deleteDoc(doc(firestoreDB, "stacks", payload?.id))
      return useMutation((payload: any) => handlePost(payload), {
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
      })};