import { addDoc, collection, getDocs, deleteDoc, setDoc, doc } from "@firebase/firestore";
import { useMutation, useQuery } from "react-query";
import { firestoreDB } from "./config";
import { notification } from "antd";

export const useGetAllProjects = () => {
  const handleGet = async () => await getDocs(collection(firestoreDB, "projects"))
  .then((data: any) => Promise.resolve(data?.docs?.map((doc: any) => ({...doc.data(), id:doc.id }))))
  return useQuery(["key:get_all_projects"], handleGet, {
  onError: (err: any) => notification.error({
    message: "Error!",
    description: err?.message || "Something went wrong."
  })
})};

export const usePostProject = (successAction?: any) => {
  const handlePost = async (payload: any) => await addDoc(collection(firestoreDB, "projects"), payload)
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

  export const usePutProject = (successAction?: any) => {
    const handlePost = async (payload: any) => await setDoc(doc(firestoreDB, "projects", payload?.id), payload)
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

    export const useDeleteProject = (successAction?: any) => {
      const handlePost = async (payload: any) => await deleteDoc(doc(firestoreDB, "projects", payload?.id))
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