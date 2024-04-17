import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { FiSave } from "react-icons/fi";
import { GoTrash } from "react-icons/go";

import { FaBitbucket, FaFacebookF, FaGithub, FaInstagram, FaLinkedin, FaTelegram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { BsThreads, BsTwitterX } from "react-icons/bs";

import { useGetProfile, usePutProfile } from "../../hooks/profile";
import { useDeleteSocial, useGetAllSocials, usePostSocial } from "../../hooks/social";
import { Button, Form, Input, Spin, Tooltip } from "antd";
// import { config } from "../../constants/config";
import authAtom from "../../atoms/auth/auth.atom";
import { styles } from "../../constants/styles";
import { ComputersCanvas } from "../canvas";
import { Props } from "../layout/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";

const Hero = ({ editable }: Props) => {
  const { isEditMode } = useRecoilValue(authAtom);
  const isCanEdit = (isEditMode && editable);
  const [intros, setIntros] = useState([]);

  const socials = [
    ["instagram", <FaInstagram className="text-x" />],
    ["bitbucket", <FaBitbucket className="text-x" />],
    ["facebook", <FaFacebookF className="text-x" />],
    ["linkedin", <FaLinkedin className="text-x" />],
    ["telegram", <FaTelegram className="text-x" />],
    ["whatsapp", <FaWhatsapp className="text-x" />],
    ["twitter", <FaTwitter className="text-x" />],
    ["thread", <BsThreads className="text-x" />],
    ["github", <FaGithub className="text-x" />],
    ["x", <BsTwitterX className="text-x" />],
  ]

  const {
    isLoading: getProfileLoad,
    refetch: getProfileFetch,
    data: getProfileData,
  } = useGetProfile((res: any) => setIntros(res?.intro))

  const {
    mutate: putProfileAction,
    isLoading: putProfileLoad,
  } = usePutProfile(getProfileFetch)

  const handleIntro = (intro: string) => putProfileAction({...getProfileData, intro: intros.filter((d: any) => (d?.toLowerCase() !== intro?.toLowerCase()))} as any)
  const handleSubmit = (data: any) => putProfileAction({...getProfileData, intro: [...intros, data?.intro]} as any)
  
  const {
    isLoading: getSocialsLoad,
    refetch: getSocialsFetch,
    data: getSocialsData,
  } = useGetAllSocials()

  const {
    mutate: postSocialAction,
    isLoading: postSocialLoad,
  } = usePostSocial(getSocialsFetch)

  const {
    mutate: deleteSocialAction,
    isLoading: deleteSocialLoad,
  } = useDeleteSocial(getSocialsFetch)

  const fetchLoad = (getProfileLoad || getSocialsLoad)
  return (
    <Spin spinning={fetchLoad}>
      <section className={`relative mx-auto h-screen w-full`}>
        <div
          className={`absolute inset-0 top-[120px] mx-auto max-w-7xl ${styles.paddingX} flex flex-row items-start gap-5`}
        >
          <div className="mt-5 flex flex-col items-center justify-center">
            <div className="h-5 w-5 rounded-full bg-[#915EFF]" />
            <div className="violet-gradient h-40 w-1 sm:h-80" />
          </div>

          <div className="w-full !z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="space-y-2">
              <h1 className={`${styles.heroHeadText} text-white`}>
                Hi, I'm <span className="text-[#915EFF]">{getProfileData?.first_name}</span>
              </h1>
              <div className="">
                {intros?.map((d: any) => (<div className="flex items-center gap-3">
                  <p className={`${styles.heroSubText} text-white-100`}>{d}</p>
                  <div hidden={!isCanEdit}>
                    <Tooltip title="Click to delete">
                      <Button loading={putProfileLoad} onClick={() => handleIntro(d)} type="primary" danger icon={<GoTrash />} />
                    </Tooltip>
                  </div>
                </div>))}
              </div>
              <Form onFinish={handleSubmit} layout="inline" hidden={!isCanEdit}>
                <Form.Item name="intro">
                  <Input required className="placeholder:!text-black" placeholder="Enter intro text" />
                </Form.Item>
                <Tooltip title="Click to save">
                  <Button loading={putProfileLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
                </Tooltip>
              </Form>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col justify-end items-center gap-3">
                {getSocialsData?.map((social: any) => (
                  <div className="flex items-center gap-3">
                    <Tooltip title={social?.name}>
                      <Link
                        target="_blank"
                        to={social?.url}
                        key={social?.id}
                        className="w-[50px] h-[50px] border border-white hover:bg-white hover:text-tertiary rounded-full flex justify-center items-center"
                      >
                        {socials?.find(([key]: any) => key?.includes(social?.name?.toLowerCase()))?.[1] || <p className="max-w-full truncate">{social?.name}</p>}
                      </Link>
                    </Tooltip>
                    <Tooltip title="Click to delete">
                      <div hidden={!isCanEdit}>
                        <Button loading={deleteSocialLoad} onClick={() => deleteSocialAction(social)} type="primary" danger icon={<GoTrash />} />
                      </div>
                    </Tooltip>
                  </div>
                ))}
              </div>
              <Form onFinish={postSocialAction} layout="inline" hidden={!isCanEdit}>
                <Form.Item name="name">
                  <Input required className="placeholder:!text-black" placeholder="Enter social media name" />
                </Form.Item>
                <Form.Item name="url">
                  <Input required className="placeholder:!text-black" placeholder="Enter social media url" />
                </Form.Item>
                <Tooltip title="Click to save">
                  <Button loading={postSocialLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
                </Tooltip>
              </Form>
            </div>
          </div>
        </div>

        <ComputersCanvas />

        <div className="xs:bottom-10 absolute bottom-32 flex w-full items-center justify-center">
          <a href="#about">
            <div className="border-secondary flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 p-2">
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="bg-secondary mb-1 h-3 w-3 rounded-full"
              />
            </div>
          </a>
        </div>
      </section>
    </Spin>
  );
};

export default Hero;
