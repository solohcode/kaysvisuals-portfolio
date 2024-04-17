import { BallCanvas } from "../canvas";
import { SectionWrapper } from "../../hoc";
import { technologies } from "../../constants";
import { Props } from "../layout/Navbar";
import { Button, Divider, Form, Input, Spin, Tooltip } from "antd";
import { useRecoilValue } from "recoil";
import authAtom from "../../atoms/auth/auth.atom";
import { useState } from "react";
import { useDeleteSkill, useGetAllSkills, usePostSkill } from "../../hooks/skill";
import { GoTrash } from "react-icons/go";
import { FiSave } from "react-icons/fi";

const Tech = ({ editable }: Props) => {
  const [payload, setPayload] = useState({ icon: "" });
  const { isEditMode } = useRecoilValue(authAtom);
  const isCanEdit = (isEditMode && editable);
  const [form] = Form.useForm();

  const {
    isLoading: getSkillsLoad,
    refetch: getSkillsFetch,
    data: getSkillsData,
  } = useGetAllSkills()

  const handleSuccess = () => {
    setPayload({ icon: "" });
    form.resetFields();
    getSkillsFetch();
  }

  const {
    mutate: postSkillAction,
    isLoading: postSkillLoad,
  } = usePostSkill(handleSuccess)

  const {
    mutate: deleteSkillAction,
    isLoading: deleteSkillLoad,
  } = useDeleteSkill(handleSuccess)

  const handleSubmit = (data: any) => postSkillAction({...data, ...payload})
  return (
    <Spin spinning={getSkillsLoad}>
      <div className="w-full">
        <div className="flex flex-row flex-wrap justify-center gap-10">
          {getSkillsData?.map((technology: any) => (
            <Tooltip title={technology?.name} key={technology?.id}>
              <div className="h-28 w-28 flex flex-col justify-center items-center" key={technology?.id}>
                  <BallCanvas icon={technology?.icon || technologies?.find(d => (d?.name?.toLowerCase()?.includes(technology?.name?.toLowerCase())))?.icon || technology?.name} />
                <Tooltip title="Click to delete">
                  <div hidden={!isCanEdit}>
                    <Button hidden={!isCanEdit} loading={deleteSkillLoad} onClick={() => deleteSkillAction(technology)} type="primary" danger icon={<GoTrash />} />
                  </div>
                </Tooltip>
              </div>
            </Tooltip>
          ))}
        </div>
        <Form onFinish={handleSubmit} layout="inline" hidden={!isCanEdit} className="my-5">
          <Form.Item name="name">
            <Input className="placeholder:!text-black" placeholder="Enter skill name" />
          </Form.Item>
          <Form.Item name="icon" className="!flex justify-between items-center">
            <Input className="placeholder:!text-black" placeholder="Enter skill's logo / icon url" value={payload?.icon} onChange={({target:{value:icon}}) => setPayload({...payload, icon})} />
            <Divider className="!border-white !text-white">OR</Divider>
            <Input className="placeholder:!text-black" placeholder="Enter skill's logo / icon" type="file" onChange={({target:{files}}) => setPayload({...payload, icon: URL.createObjectURL(files?.[0] as Blob)})} />
          </Form.Item>
          <Form.Item name="start_year">
            <Input className="placeholder:!text-black" placeholder="Enter start year" />
          </Form.Item>
          <Tooltip title="Click to save">
            <Button loading={postSkillLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
          </Tooltip>
        </Form>
      </div>
    </Spin>
  );
};

export default SectionWrapper(Tech, "tech");
