import type { ComponentProps } from "react";

export default function Logo(props: ComponentProps<"svg">) {
	return (
		<svg {...props} viewBox="0 0 32 32" fill="none">
			<title>Logo</title>
			<path
				d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
				fill="#025964"
			/>
			<g clipPath="url(#clip0_223_15481)">
				<path
					d="M16 6.98306L12 4V12H4L6.98306 16L4 20H12V12L20 12V4L16 6.98306ZM25.0169 16L28 12L20 12V20H12V28L16 25.0169L20 28V20H28L25.0169 16Z"
					fill="white"
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</g>
			<defs>
				<clipPath id="clip0_223_15481">
					<rect
						width="24"
						height="24"
						fill="white"
						transform="translate(4 4)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
}
