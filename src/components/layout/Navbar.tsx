import { useRecoilValue } from "recoil";
import { FiSave } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input, Tooltip } from "antd";

// import { logo, menu, close } from "../../assets";
import { useGetProfile, usePutProfile } from "../../hooks/profile";
// import { config } from "../../constants/config";
import authAtom from "../../atoms/auth/auth.atom";
import { styles } from "../../constants/styles";
import { navLinks } from "../../constants";
import { menu, close } from "../../assets";


export type Props = {
  editable?: boolean
}
const Navbar = ({ editable }: Props) => {
  const [active, setActive] = useState<string | null>();
  const { isEditMode } = useRecoilValue(authAtom);
  const [scrolled, setScrolled] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [form] = Form.useForm();

  const isCanEdit = (isEditMode && editable);

  const {
    data: getProfileData,
    refetch: getProfileFetch,
    // isLoading: getProfileLoad,
  } = useGetProfile((res: any) => form.setFieldsValue(res))

  const {
    mutate: putProfileAction,
    isLoading: putProfileLoad,
  } = usePutProfile(getProfileFetch)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
        setActive("");
      }
    };

    window.addEventListener("scroll", handleScroll);

    const navbarHighlighter = () => {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((current) => {
        const sectionId = current.getAttribute("id");
        // @ts-ignore
        const sectionHeight = current.offsetHeight;
        const sectionTop =
          current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (sectionTop < 0 && sectionTop + sectionHeight > 0) {
          setActive(sectionId);
        }
      });
    };

    window.addEventListener("scroll", navbarHighlighter);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", navbarHighlighter);
    };
  }, []);

  const handleUpdate = (data: any) => putProfileAction({...getProfileData, ...data})
  return (
    <nav
      className={`${
        styles.paddingX
      } fixed top-0 z-20 flex w-full items-center py-5 ${
        scrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div>
          {isCanEdit ? (
            <Form onFinish={handleUpdate} initialValues={getProfileData} form={form} layout="inline">
              <Form.Item name="first_name">
                <Input required className="placeholder:!text-black" placeholder="Enter first name" />
              </Form.Item>
              <Form.Item name="last_name">
                <Input required className="placeholder:!text-black" placeholder="Enter last name" />
              </Form.Item>
              <Tooltip title="Click to save">
                <Button loading={putProfileLoad} className="bg-secondary" type="primary" htmlType="submit" icon={<FiSave />} />
              </Tooltip>
            </Form>
          ) : (
            <Link
              to={editable ? "/admin" : "/"}
              className="flex items-center gap-2"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              {/* <img src={logo} alt="logo" className="h-9 w-9 object-contain" /> */}
              <p className="flex cursor-pointer text-[18px] font-bold text-white ">
                {`${getProfileData?.first_name || "Qudus"} ${getProfileData?.last_name || "Odupitan"}`}
              </p>
            </Link>
          )}
        </div>

        <ul className="hidden list-none flex-row gap-10 sm:flex items-center">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.id ? "text-white" : "text-secondary"
              } cursor-pointer text-[18px] font-medium hover:text-white`}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>

        <div className="flex flex-1 items-center justify-end sm:hidden">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="h-[28px] w-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } black-gradient absolute right-0 top-20 z-10 mx-4 my-2 min-w-[140px] rounded-xl p-6`}
          >
            <ul className="flex flex-1 list-none flex-col items-start justify-end gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins cursor-pointer text-[16px] font-medium ${
                    active === nav.id ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
