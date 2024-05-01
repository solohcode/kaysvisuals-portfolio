import { styles } from "../../constants/styles";
// import { testimonials } from "../../constants";
import { Header } from "../atoms/Header";
import { config } from "../../constants/config";
import { Props } from "../layout/Navbar";
import { Button, Divider, Form, Input, Spin, Tooltip } from "antd";
import { useState } from "react";
import { FiSave } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import authAtom from "../../atoms/auth/auth.atom";
import { useGetProfile, usePutProfile } from "../../hooks/profile";
import { getBase64 } from "../../hooks/config";
import { handleObject } from "../../utils/utils";

const Resume = ({ editable }: Props) => {
  const [payload, setPayload] = useState({ resume: "" });
  const { isEditMode } = useRecoilValue(authAtom);
  const isCanEdit = (isEditMode && editable);
  const [form] = Form.useForm();

  const {
    isLoading: getProfileLoad,
    refetch: getProfileFetch,
    data: getProfileData,
  } = useGetProfile()

  const handleSuccess = () => {
    setPayload({ resume: "" });
    getProfileFetch();
    form.resetFields();
  }

  const {
    mutate: putProfileAction,
    isLoading: putProfileLoad,
  } = usePutProfile(handleSuccess)


  const handleSubmit = () => putProfileAction(handleObject({...getProfileData, ...payload}))
  return (
    <Spin spinning={getProfileLoad}>
      <div className="bg-black-100 mt-12 rounded-[20px]">
        <div
          className={`${styles.padding} bg-tertiary min-h-[300px] rounded-2xl`}
        >
          <Header useMotion={true} {...config.sections.resume} />
        </div>

        <div className={`${styles.paddingX} -mt-20 space-y-5 md:space-y-10 px-5 sm:px-10 md:px-20 pb-10`}>
          <iframe
            className="w-full h-[80vh]"
            src={getProfileData?.resume}
            title={`${getProfileData?.first_name} Resume`}
          />
          <div className="w-full">
            <a
              className="bg-tertiary shadow-primary w-fit rounded-xl px-8 py-3 font-bold text-white shadow-md outline-none"
              download={`${getProfileData?.first_name}-${getProfileData?.last_name}-resume`}
              href={getProfileData?.resume}
              rel="noopener noreferrer"
              target="_blank"
            >Download Resume</a>
          </div>

          <Form onFinish={handleSubmit} layout="vertical" hidden={!isCanEdit} form={form}>
            <Form.Item name="resume" className="!flex justify-between items-center">
              <Input required className="placeholder:!text-black" placeholder="Enter resumes url" value={payload?.resume} onChange={({target:{value:resume}}) => setPayload({...payload, resume})} />
              <Divider className="!border-white !text-white">OR</Divider>
              <Input required={!payload?.resume} className="placeholder:!text-black" placeholder="Enter resumes" type="file" onChange={({target:{files}}) => getBase64(files?.[0] as any).then((resume: any) => {setPayload({...payload, resume}); form.setFieldsValue({resume})})} />
            </Form.Item>
            <Tooltip title="Click to save">
              <Button loading={putProfileLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
            </Tooltip>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default Resume;
