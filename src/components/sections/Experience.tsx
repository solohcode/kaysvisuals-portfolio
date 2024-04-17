import React, { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { FiSave } from "react-icons/fi";
import { GoTrash } from "react-icons/go";
import { useDeleteExperience, useGetAllExperiences, usePostExperience, usePutExperience } from "../../hooks/experience";

import "react-vertical-timeline-component/style.min.css";

import { experiences } from "../../constants";
import { SectionWrapper } from "../../hoc";
import { Header } from "../atoms/Header";
import { TExperience } from "../../types";
import { config } from "../../constants/config";
import authAtom from "../../atoms/auth/auth.atom";
import { useRecoilValue } from "recoil";
import { Props } from "../layout/Navbar";
import { Button, Divider, Form, Input, Spin, Tooltip } from "antd";
import { FaEdit } from "react-icons/fa";

const ExperienceCard: React.FC<TExperience> = (experience) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={experience.icon}
            alt={experience.companyName}
            className="h-[60%] w-[60%] object-contain"
          />
        </div>
      }
    >
      <div className="w-full flex justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-white">{experience.title}</h3>
          <p
            className="text-secondary text-[16px] font-semibold"
            style={{ margin: 0 }}
          >
            {experience.companyName}
          </p>
        </div>
        <div hidden={!experience?.editable} className="space-x-3">
          <Tooltip title="Click to edit">
            <Button loading={experience?.loading} onClick={() => experience?.handleEdit(experience?.id)} type="primary" icon={<FaEdit />} />
          </Tooltip>
          <Tooltip title="Click to delete">
            <Button loading={experience?.loading} onClick={() => experience?.handleAction(experience?.id)} type="primary" danger icon={<GoTrash />} />
          </Tooltip>
        </div>
      </div>

      <ul className="ml-5 mt-5 list-disc space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 pl-1 text-[14px] tracking-wider"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = ({ editable }: Props) => {
  const [payload, setPayload] = useState({ company_logo: "" });
  const { isEditMode } = useRecoilValue(authAtom);
  const isCanEdit = (isEditMode && editable);
  const [form] = Form.useForm();

  const {
    isLoading: getExperiencesLoad,
    refetch: getExperiencesFetch,
    data: getExperiencesData,
  } = useGetAllExperiences()

  const handleSuccess = () => {
    setPayload({ company_logo: "" });
    getExperiencesFetch();
    form.resetFields();
  }

  const {
    mutate: postExperienceAction,
    isLoading: postExperienceLoad,
  } = usePostExperience(handleSuccess)

  const {
    mutate: putExperienceAction,
    isLoading: putExperienceLoad,
  } = usePutExperience(handleSuccess)

  const {
    mutate: deleteExperienceAction,
    isLoading: deleteExperienceLoad,
  } = useDeleteExperience(handleSuccess)

  const handleEdit = (data: any) => {
    form.setFieldsValue(data);
    setPayload(data);
  }

  const handleSubmit = (data: any) => {
    const payData = {...payload, ...data}
    if (payData?.id) return putExperienceAction(payData)
    postExperienceAction(payData)
  }

  const actionLoad = (postExperienceLoad || putExperienceLoad)
  return (
    <Spin spinning={getExperiencesLoad}>
      <div className="w-full">
        <Header useMotion={true} {...config.sections.experience} />

        <div className="mt-20 flex flex-col">
          <VerticalTimeline>
            {getExperiencesData?.map((experience: any, index: number) => (
              <ExperienceCard
                key={index}
                id={experience}
                editable={isCanEdit}
                handleEdit={handleEdit}
                title={experience?.title}
                loading={deleteExperienceLoad}
                icon={experience?.company_logo}
                points={[experience?.description]}
                handleAction={deleteExperienceAction}
                companyName={experience?.company_name}
                iconBg={experiences?.[index%4]?.iconBg}
                date={`${experience?.start_date} - ${experience?.end_date}`}
              />
            ))}
          </VerticalTimeline>
        </div>

        <div hidden={!isCanEdit} className="w-full">
          <Form onFinish={handleSubmit} layout="inline" hidden={!isCanEdit} form={form} className="my-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5">
            <Form.Item name="title">
              <Input className="placeholder:!text-black" placeholder="Enter job title" />
            </Form.Item>
            <Form.Item name="company_name">
              <Input className="placeholder:!text-black" placeholder="Enter company's name" />
            </Form.Item>
            <Form.Item name="company_url">
              <Input className="placeholder:!text-black" placeholder="Enter company's website url" />
            </Form.Item>
            <Form.Item name="start_date">
              <Input className="placeholder:!text-black" placeholder="Enter start date" />
            </Form.Item>
            <Form.Item name="end_date">
              <Input className="placeholder:!text-black" placeholder="Enter end date" />
            </Form.Item>
            <Form.Item name="company_logo" className="!flex justify-between items-center">
              <Input className="placeholder:!text-black" placeholder="Enter company's logo / icon url" value={payload?.company_logo} onChange={({target:{value:company_logo}}) => setPayload({...payload, company_logo})} />
              <Divider className="!border-white !text-white">OR</Divider>
              <Input className="placeholder:!text-black" placeholder="Enter company's logo / icon" type="file" onChange={({target:{files}}) => setPayload({...payload, company_logo: URL.createObjectURL(files?.[0] as Blob)})} />
            </Form.Item>
            <Form.Item name="description">
              <Input.TextArea className="placeholder:!text-black" placeholder="Enter job description" rows={5} />
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

export default SectionWrapper(Experience, "work");
