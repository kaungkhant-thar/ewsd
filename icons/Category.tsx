import * as React from "react";
const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.667 2H2v6h4.667zM14 2H9.335v3.333h4.667zm0 6H9.335v6h4.667zm-7.333 2.668H2v3.333h4.667z"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default CategoryIcon;
