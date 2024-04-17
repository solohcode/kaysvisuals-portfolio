import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { github } from "../../assets";
import { SectionWrapper } from "../../hoc";
import { projects } from "../../constants";
import { fadeIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";
import { TProject } from "../../types";
import { Props } from "../layout/Navbar";
import { useRecoilValue } from "recoil";
import authAtom from "../../atoms/auth/auth.atom";
import { Button, Divider, Form, Input, Select, Spin, Tooltip } from "antd";
import { useGetProfile, usePutProfile } from "../../hooks/profile";
import { FiSave } from "react-icons/fi";
import { useDeleteProject, useGetAllProjects, usePostProject, usePutProject } from "../../hooks/project";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

const ProjectCard: React.FC<{ index: number } & TProject> = ({
  index,
  name,
  tags,
  id,
  image,
  loading,
  editable,
  handleEdit,
  description,
  handleAction,
  sourceCodeLink,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        glareEnable
        tiltEnable
        tiltMaxAngleX={30}
        tiltMaxAngleY={30}
        glareColor="#aaa6c3"
      >
        <div className="bg-tertiary w-full rounded-2xl p-5 sm:w-[300px]">
          <div className="relative h-[230px] w-full">
            <img
              src={image}
              alt={name}
              className="h-full w-full rounded-2xl object-cover"
            />
            <div className="card-img_hover absolute inset-0 m-3 flex justify-end gap-3">
              <div
                onClick={() => window.open(sourceCodeLink, "_blank")}
                className="black-gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              >
                <img
                  src={github}
                  alt="github"
                  className="h-1/2 w-1/2 object-contain"
                />
              </div>
              <div hidden={!editable} className="space-x-3">
                <Tooltip title="Click to edit">
                  <Button loading={loading} onClick={() => handleEdit(id)} type="primary" icon={<FaEdit />} />
                </Tooltip>
                <Tooltip title="Click to delete">
                  <Button loading={loading} onClick={() => handleAction(id)} type="primary" danger icon={<GoTrash />} />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-[24px] font-bold text-white">{name}</h3>
            <p className="text-secondary mt-2 text-[14px]">{description}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <p key={tag.name} className={`text-[14px] ${tag.color}`}>
                #{tag.name}
              </p>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = ({ editable }: Props) => {
  const [payload, setPayload] = useState({ image: "" });
  const { isEditMode } = useRecoilValue(authAtom);
  const isCanEdit = (isEditMode && editable);
  const [form] = Form.useForm();

  const {
    isLoading: getProfileLoad,
    refetch: getProfileFetch,
    data: getProfileData,
  } = useGetProfile((res: any) => form.setFieldsValue(res))

  const {
    mutate: putProfileAction,
    isLoading: putProfileLoad,
  } = usePutProfile(getProfileFetch)

  const handleUpdate = (data: any) => putProfileAction({...getProfileData, ...data} as any)

  const {
    isLoading: getProjectsLoad,
    refetch: getProjectsFetch,
    data: getProjectsData,
  } = useGetAllProjects()

  const handleSuccess = () => {
    setPayload({ image: "" });
    getProjectsFetch();
    form.resetFields();
  }

  const {
    mutate: postProjectAction,
    isLoading: postProjectLoad,
  } = usePostProject(handleSuccess)

  const {
    mutate: putProjectAction,
    isLoading: putProjectLoad,
  } = usePutProject(handleSuccess)

  const {
    mutate: deleteProjectAction,
    isLoading: deleteProjectLoad,
  } = useDeleteProject(handleSuccess)

  const handleEdit = (data: any) => {
    form.setFieldsValue(data);
    setPayload(data);
  }

  const handleSubmit = (data: any) => {
    const payData = {...payload, ...data}
    if (payData?.id) return putProjectAction(payData)
    postProjectAction(payData)
  }

  const fetchLoad = (getProfileLoad || getProjectsLoad)
  const actionLoad = (postProjectLoad || putProjectLoad)
  return (
    <Spin spinning={fetchLoad}>
      <div>
        <Header useMotion={true} {...config.sections.works} />

        {isCanEdit ? (
          <Form onFinish={handleUpdate} layout="vertical" form={form} hidden={!isCanEdit}>
            <Form.Item name="project_headline">
              <Input.TextArea rows={5} placeholder="Enter project headline" />
            </Form.Item>
            <Tooltip title="Click to save">
              <Button loading={putProfileLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
            </Tooltip>
          </Form>
        ) : (
          <div className="flex w-full">
            <motion.p
              variants={fadeIn("", "", 0.1, 1)}
              className="text-secondary mt-3 max-w-3xl text-[17px] leading-[30px]"
            >
              {getProfileData?.project_headline}
            </motion.p>
          </div>
        )}

        <div className="mt-20 flex flex-wrap gap-7">
          {getProjectsData?.map((project: any, index: number) => (
            <ProjectCard
              tags={project?.skills?.map((d: string, idx: number) => ({
                color: projects?.[index%3]?.tags?.[idx%3]?.color,
                name: d,
              }))}
              image={project?.image || projects?.[index%3]?.image}
              description={project?.description}
              handleAction={deleteProjectAction}
              sourceCodeLink={project?.url}
              loading={deleteProjectLoad}
              handleEdit={handleEdit}
              name={project?.name}
              editable={isCanEdit}
              key={project?.id}
              index={index}
              id={project}
            />
          ))}
        </div>

        <div hidden={!isCanEdit} className="w-full">
          <Form onFinish={handleSubmit} layout="inline" hidden={!isCanEdit} form={form} className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Form.Item name="name">
              <Input className="placeholder:!text-black" placeholder="Enter project name" />
            </Form.Item>
            <Form.Item name="url">
              <Input className="placeholder:!text-black" placeholder="Enter project url" />
            </Form.Item>
            <Form.Item name="skills">
              <Select className="placeholder:!text-black" placeholder="Enter project skills" mode="tags" />
            </Form.Item>
            <Form.Item name="image" className="!flex justify-between items-center">
              <Input className="placeholder:!text-black" placeholder="Enter project's image url" value={payload?.image} onChange={({target:{value:image}}) => setPayload({...payload, image})} />
              <Divider className="!border-white !text-white">OR</Divider>
              <Input className="placeholder:!text-black" placeholder="Enter company's logo / icon" type="file" onChange={({target:{files}}) => setPayload({...payload, image: URL.createObjectURL(files?.[0] as Blob)})} />
            </Form.Item>
            <Form.Item name="description">
              <Input.TextArea className="placeholder:!text-black" placeholder="Enter project description" rows={5} />
            </Form.Item>
            <Tooltip title="Click to save">
              <Button loading={actionLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
            </Tooltip>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default SectionWrapper(Works, "");
