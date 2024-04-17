import { addDoc, collection, getDocs, deleteDoc, setDoc, doc } from "@firebase/firestore";
import { useMutation, useQuery } from "react-query";
import { firestoreDB } from "./config";
import { notification } from "antd";

export const useGetAllSkills = () => {
  const handleGet = async () => await getDocs(collection(firestoreDB, "skills"))
  .then((data: any) => Promise.resolve(data?.docs?.map((doc: any) => ({...doc.data(), id:doc.id }))))
  return useQuery(["key:get_all_skills"], handleGet, {
  onError: (err: any) => notification.error({
    message: "Error!",
    description: err?.message || "Something went wrong."
  })
})};

export const usePostSkill = (successAction?: any) => {
  const handlePost = async (payload: any) => await addDoc(collection(firestoreDB, "skills"), payload)
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

  export const usePutSkill = (successAction?: any) => {
    const handlePost = async (payload: any) => await setDoc(doc(firestoreDB, "skills", payload?.id), payload)
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

    export const useDeleteSkill = (successAction?: any) => {
      const handlePost = async (payload: any) => await deleteDoc(doc(firestoreDB, "skills", payload?.id))
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