import { addDoc, collection, getDocs, deleteDoc, setDoc, doc } from "@firebase/firestore";
import { useMutation, useQuery } from "react-query";
import { firestoreDB } from "./config";
import { notification } from "antd";

export const useGetAllSocials = () => {
  const handleGet = async () => await getDocs(collection(firestoreDB, "socials"))
  .then((data: any) => Promise.resolve(data?.docs?.map((doc: any) => ({...doc.data(), id:doc.id }))))
  return useQuery(["key:get_all_socials"], handleGet, {
  onError: (err: any) => notification.error({
    message: "Error!",
    description: err?.message || "Something went wrong."
  })
})};

export const usePostSocial = (successAction?: any) => {
  const handlePost = async (payload: any) => await addDoc(collection(firestoreDB, "socials"), payload)
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

  export const usePutSocial = (successAction?: any) => {
    const handlePost = async (payload: any) => await setDoc(doc(firestoreDB, "socials", payload?.id), payload)
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

    export const useDeleteSocial = (successAction?: any) => {
      const handlePost = async (payload: any) => await deleteDoc(doc(firestoreDB, "socials", payload?.id))
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