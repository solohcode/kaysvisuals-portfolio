import { addDoc, collection, getDocs, deleteDoc, setDoc, doc } from "@firebase/firestore";
import { useMutation, useQuery } from "react-query";
import { firestoreDB } from "./config";
import { notification } from "antd";

export const useGetAllEducations = () => {
  const handleGet = async () => await getDocs(collection(firestoreDB, "education"))
  .then((data: any) => Promise.resolve(data?.docs?.map((doc: any) => ({...doc.data(), id:doc.id }))))
  return useQuery(["key:get_all_educations"], handleGet, {
  onError: (err: any) => notification.error({
    message: "Error!",
    description: err?.message || "Something went wrong."
  })
})};

export const usePostEducation = (successAction?: any) => {
  const handlePost = async (payload: any) => await addDoc(collection(firestoreDB, "education"), payload)
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

  export const usePutEducation = (successAction?: any) => {
    const handlePost = async (payload: any) => await setDoc(doc(firestoreDB, "education", payload?.id), payload)
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

    export const useDeleteEducation = (successAction?: any) => {
      const handlePost = async (payload: any) => await deleteDoc(doc(firestoreDB, "education", payload?.id))
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