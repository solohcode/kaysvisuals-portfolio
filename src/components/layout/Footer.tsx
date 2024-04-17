import { useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal, Switch, notification } from "antd";

// import { logo, menu, close } from "../../assets";
import { useGetProfile, usePutProfile } from "../../hooks/profile";
// import { config } from "../../constants/config";
import authAtom from "../../atoms/auth/auth.atom";
import { styles } from "../../constants/styles";


export type Props = {
  editable?: boolean
}
const Footer = ({ editable }: Props) => {
  const [form] = Form.useForm();
  const [{ isEditMode }, setAuthAtom] = useRecoilState(authAtom);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const navigate = useNavigate();
  const onClose = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const isCanEdit = (isEditMode && editable);

  const {
    isLoading: getProfileLoad,
    refetch: getProfileFetch,
    data: getProfileData,
  } = useGetProfile()

  const {
    mutate: putProfileAction,
    isLoading: putProfileLoad,
  } = usePutProfile(getProfileFetch)

  const handleSubmit = (data: any) => {
    if ((getProfileData?.email === data?.email) && (getProfileData?.password === data?.password)) {
      notification.success({
        description: `Welcome back to edit mode ${getProfileData?.first_name || getProfileData?.last_name}`,
        message: "Success!",
      })
      setAuthAtom({ isEditMode: true })
      navigate("/admin")
    } else {
      notification.error({
        description: "Wrong credentials, intruder report sent...",
        message: "Error!",
      })
      setAuthAtom({ isEditMode: false })
    }
  }

  const handleUpdate = (data: any) => putProfileAction({...getProfileData, ...data})

  const handleForm = (data: any) => {
    if (isCanEdit) return handleUpdate(data)
    handleSubmit(data)
  }

  const handleEdit = () => {
    form.setFieldsValue(getProfileData)
    onOpen()
  }

  const handleToggle = () => {
    if (isEditMode) { navigate("/")
      setAuthAtom({ isEditMode: false })
      notification.success({
        description: "Mode set to view.",
        message: "Success!",
      })
    } else onOpen()
  }

  const ModeSwitch = () => (
    <div>
      <Switch
        unCheckedChildren="Edit Mode"
        checkedChildren="View Mode"
        loading={getProfileLoad}
        onChange={handleToggle}
        checked={!isEditMode}
      />
      
    </div>
  )
  return (
    <div
      className={`${
        styles.paddingX
      } flex w-full items-center py-5 bg-primary`}
    >

      <div className="w-full flex flex-col md:flex-row justify-between items-center !capitalize">
        <p>Copyright {getProfileData?.first_name} {new Date().getFullYear()}</p>
        <div className="flex flex-col md:flex-row items-center gap-5">
          <p>Email: <a href={`mailto:${getProfileData?.email}`}>{getProfileData?.email}</a></p>
          <p>Contact: <a href={`tel:${getProfileData?.phone}`}>{getProfileData?.phone}</a></p>
          <Button hidden={!isCanEdit} onClick={handleEdit} type='primary'>Edit info</Button>
          <ModeSwitch />
        </div>
      </div>

      <Modal
        open={isOpen}
        footer={false}
        onCancel={onClose}
        title="Edit Mode Authentication"
      >
        <Form onFinish={handleForm} layout="vertical" form={form}>
          <Form.Item label="Auth Email" name="email">
            <Input required placeholder="Enter auth email" size="large" type="email" />
          </Form.Item>
          <Form.Item label="Auth Password" name="password">
            <Input.Password required placeholder="Enter auth password" size="large" />
          </Form.Item>
          <Form.Item hidden={!isCanEdit} label="Contact Number" name="phone">
            <Input required placeholder="Enter contact number" size="large" />
          </Form.Item>
          <Button loading={putProfileLoad} className="bg-tertiary" type="primary" htmlType="submit" size="large" block>{isCanEdit? "Save" : "Authenticate"}</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Footer;
