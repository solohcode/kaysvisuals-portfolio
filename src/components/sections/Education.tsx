import { motion } from "framer-motion";

import { styles } from "../../constants/styles";
import { fadeIn } from "../../utils/motion";
// import { testimonials } from "../../constants";
import { Header } from "../atoms/Header";
import { TTestimonial } from "../../types";
import { config } from "../../constants/config";
import { Props } from "../layout/Navbar";
import { Button, Divider, Form, Input, Spin, Tooltip } from "antd";
import { useState } from "react";
import { FiSave } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import authAtom from "../../atoms/auth/auth.atom";
import { useDeleteEducation, useGetAllEducations, usePostEducation, usePutEducation } from "../../hooks/education";
import { FaEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { getBase64 } from "../../hooks/config";
import { handleObject } from "../../utils/utils";

const EducationCard: React.FC<{ index: number } & TTestimonial> = ({
  index,
  testimonial,
  name,
  id,
  title,
  loading,
  editable,
  handleEdit,
  handleAction,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="bg-black-200 xs:w-[320px] w-full rounded-3xl p-10"
  >
    <div hidden={!editable} className="space-x-3">
      <Tooltip title="Click to edit">
        <Button loading={loading} onClick={() => handleEdit(id)} type="primary" icon={<FaEdit />} />
      </Tooltip>
      <Tooltip title="Click to delete">
        <Button loading={loading} onClick={() => handleAction(id)} type="primary" danger icon={<GoTrash />} />
      </Tooltip>
    </div>
    <p className="text-2xl font-black text-white">{title || '"'}</p>

    <div className="mt-1">
      <p className="text-[18px] tracking-wider text-white">{testimonial}</p>

      <div className="mt-7 flex items-center justify-between gap-1">
        <div className="flex flex-1 flex-col">
          <p className="text-[16px] font-medium text-white">
            <span className="blue-text-gradient">@</span> {name}
          </p>
          <p className="text-secondary mt-1 text-[12px]">
            {designation} to {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
    </div>
  </motion.div>
);

const Education = ({ editable }: Props) => {
  const [payload, setPayload] = useState({ institution_logo: "" });
  const { isEditMode } = useRecoilValue(authAtom);
  const isCanEdit = (isEditMode && editable);
  const [form] = Form.useForm();

  const {
    isLoading: getEducationsLoad,
    refetch: getEducationsFetch,
    data: getEducationsData,
  } = useGetAllEducations()

  const handleSuccess = () => {
    setPayload({ institution_logo: "" });
    getEducationsFetch();
    form.resetFields();
  }

  const {
    mutate: postEducationAction,
    isLoading: postEducationLoad,
  } = usePostEducation(handleSuccess)

  const {
    mutate: putEducationAction,
    isLoading: putEducationLoad,
  } = usePutEducation(handleSuccess)

  const {
    mutate: deleteEducationAction,
    isLoading: deleteEducationLoad,
  } = useDeleteEducation(handleSuccess)

  const handleEdit = (data: any) => {
    form.setFieldsValue(data);
    setPayload(data);
  }

  const handleSubmit = (data: any) => {
    const payData = handleObject({...payload, ...data})
    if (payData?.id) return putEducationAction(payData)
    postEducationAction(payData)
  }

  const actionLoad = (postEducationLoad || putEducationLoad)
  return (
    <Spin spinning={getEducationsLoad}>
      <div className="bg-black-100 mt-12 rounded-[20px]">
        <div
          className={`${styles.padding} bg-tertiary min-h-[300px] rounded-2xl`}
        >
          <Header useMotion={true} {...config.sections.education} />
        </div>

        <div
          className={`${styles.paddingX} -mt-20 flex flex-wrap gap-7 pb-14 max-sm:justify-center`}
        >
          {getEducationsData?.map((education: any, index: any) => (
            <EducationCard
              testimonial={education?.description}
              handleAction={deleteEducationAction}
              designation={education?.start_year}
              image={education?.institution_logo}
              name={education?.institution_name}
              loading={deleteEducationLoad}
              company={education?.end_year}
              title={education?.title}
              handleEdit={handleEdit}
              editable={isCanEdit}
              key={education?.id}
              id={education}
              index={index}
            />
          ))}
        </div>

        <div hidden={!isCanEdit} className="w-full">
          <Form onFinish={handleSubmit} layout="inline" hidden={!isCanEdit} form={form} className="p-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5">
            <Form.Item name="title">
              <Input required className="placeholder:!text-black" placeholder="Enter education title" />
            </Form.Item>
            <Form.Item name="field">
              <Input required className="placeholder:!text-black" placeholder="Enter field of study" />
            </Form.Item>
            <Form.Item name="institution_name">
              <Input required className="placeholder:!text-black" placeholder="Enter institution's name" />
            </Form.Item>
            <Form.Item name="start_year">
              <Input required className="placeholder:!text-black" placeholder="Enter start year" />
            </Form.Item>
            <Form.Item name="end_year">
              <Input required className="placeholder:!text-black" placeholder="Enter end year" />
            </Form.Item>
            <Form.Item name="institution_logo" className="!flex justify-between items-center">
              <Input required className="placeholder:!text-black" placeholder="Enter institution's logo / icon url" value={payload?.institution_logo} onChange={({target:{value:institution_logo}}) => setPayload({...payload, institution_logo})} />
              <Divider className="!border-white !text-white">OR</Divider>
              <Input required={!payload?.institution_logo} className="placeholder:!text-black" placeholder="Enter institution's logo / icon" type="file" onChange={({target:{files}}) => getBase64(files?.[0] as any).then((institution_logo: any) => setPayload({...payload, institution_logo}))} />
            </Form.Item>
            <Form.Item name="description">
              <Input.TextArea required className="placeholder:!text-black" placeholder="Enter description" rows={5} />
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

export default Education;
