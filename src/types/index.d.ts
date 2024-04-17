export type TCommonProps = {
  title?: string;
  name?: string;
  icon?: string;
};

export type TExperience = {
  companyName: string;
  iconBg: string;
  date: string;
  id?: string;
  points: string[],
  handleEdit?: any,
  loading?: boolean,
  handleAction?: any,
  editable?: boolean,
} & Required<Omit<TCommonProps, "name">>;

export type TTestimonial = {
  testimonial: string;
  designation: string;
  company: string;
  image: string;
  id?: any;
  title?: string;
  handleEdit?: any;
  loading?: boolean;
  editable?: boolean;
  handleAction?: any;
} & Required<Pick<TCommonProps, "name">>;

export type TProject = {
  description: string;
  editable?: boolean;
  tags: {
    name: string;
    color: string;
  }[];
  id?: any;
  image: string;
  handleEdit?: any;
  loading?: boolean;
  handleAction?: any;
  sourceCodeLink: string;
} & Required<Pick<TCommonProps, "name">>;

export type TTechnology = Required<Omit<TCommonProps, "title">>;

export type TNavLink = {
  id: string;
} & Required<Pick<TCommonProps, "title">>;

export type TService = Required<Omit<TCommonProps, "name">>;

export type TMotion = {
  direction: "up" | "down" | "left" | "right" | "";
  type: "tween" | "spring" | "just" | "";
  delay: number;
  duration: number;
};
