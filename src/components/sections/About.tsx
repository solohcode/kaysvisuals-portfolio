import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { FiSave } from "react-icons/fi";
import { GoTrash } from "react-icons/go";

import { services } from "../../constants";
import { SectionWrapper } from "../../hoc";
import { fadeIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";
import { useGetProfile, usePutProfile } from "../../hooks/profile";
import { useDeleteStack, useGetAllStacks, usePostStack } from "../../hooks/stack";
import { Button, Form, Input, Spin, Tooltip } from "antd";
import authAtom from "../../atoms/auth/auth.atom";
import { Props } from "../layout/Navbar";
import { useRecoilValue } from "recoil";

interface IServiceCard {
  editable?: boolean;
  handleAction?: any;
  loading?: boolean;
  index: number;
  title: string;
  icon: string;
  id: string;
}

const ServiceCard: React.FC<IServiceCard> = ({ id, index, title, icon, editable, loading, handleAction }) => (
  <Tilt
    glareEnable
    tiltEnable
    tiltMaxAngleX={30}
    tiltMaxAngleY={30}
    glareColor="#aaa6c3"
  >
    <div className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className="green-pink-gradient shadow-card w-full rounded-[20px] p-[1px]"
      >
        <div className="bg-tertiary flex min-h-[280px] flex-col items-center justify-evenly rounded-[20px] px-12 py-5">
          <div hidden={!editable}>
            <Tooltip title="Click to delete">
              <Button loading={loading} onClick={() => handleAction(id)} type="primary" danger icon={<GoTrash />} />
            </Tooltip>
          </div>
          <img
            src={icon}
            alt="web-development"
            className="h-16 w-16 object-contain"
          />

          <h3 className="text-center text-[20px] font-bold text-white">
            {title}
          </h3>
        </div>
      </motion.div>
    </div>
  </Tilt>
);

const About = ({ editable }: Props) => {
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

  const {
    isLoading: getStacksLoad,
    refetch: getStacksFetch,
    data: getStacksData,
  } = useGetAllStacks()

  const {
    mutate: postStackAction,
    isLoading: postStackLoad,
  } = usePostStack(getStacksFetch)

  const {
    mutate: deleteStackAction,
    isLoading: deleteStackLoad,
  } = useDeleteStack(getStacksFetch)

  const handleSubmit = (data: any) => putProfileAction({...getProfileData, ...data} as any)
  return (
    <Spin spinning={getProfileLoad}>
      <div className="w-full">
        <Header useMotion={true} {...config.sections.about} />

        {isCanEdit ? (
          <Form onFinish={handleSubmit} layout="vertical" form={form} hidden={!isCanEdit}>
            <Form.Item name="overview">
              <Input.TextArea required rows={5} placeholder="Enter profile overview" />
            </Form.Item>
            <Tooltip title="Click to save">
              <Button loading={putProfileLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
            </Tooltip>
          </Form>
        ) : (
          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className="text-secondary mt-4 max-w-3xl text-[17px] leading-[30px]"
          >
            {/* {config.sections.about.content} */}
            {getProfileData?.overview}
          </motion.p>
        )}

        <Spin spinning={getStacksLoad}>
          <div className="mt-20 flex flex-wrap gap-10 max-sm:justify-center">
            {getStacksData?.map((service: any, index: number) => (
              <ServiceCard
                id={service}
                index={index}
                key={service?.id}
                editable={isCanEdit}
                title={service?.name}
                loading={deleteStackLoad}
                handleAction={deleteStackAction}
                icon={services?.[index%4]?.icon}
              />
            ))}
          </div>
        </Spin>

        <Form onFinish={postStackAction} layout="inline" hidden={!isCanEdit} className="my-5">
          <Form.Item name="name">
            <Input required className="placeholder:!text-black" placeholder="Enter stack name" />
          </Form.Item>
          <Form.Item name="start_year">
            <Input required className="placeholder:!text-black" placeholder="Enter start year" />
          </Form.Item>
          <Tooltip title="Click to save">
            <Button loading={postStackLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
          </Tooltip>
        </Form>
      </div>
    </Spin>
  );
};

export default SectionWrapper(About, "about");
