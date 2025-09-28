export default function JP({ ...props }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" fill="none" viewBox="0 0 16 12" {...props}>
            <g clipPath="url(#clip0_270_55029)">
                <path fill="#fff" d="M0 0h16v12H0z" />
                <path fill="#F7FCFF" fillRule="evenodd" d="M0 0v12h16V0z" clipRule="evenodd" />
                <mask
                    id="mask0_270_55029"
                    width="16"
                    height="12"
                    x="0"
                    y="0"
                    maskUnits="userSpaceOnUse"
                    style={{ maskType: "luminance" }}
                >
                    <path fill="#fff" fillRule="evenodd" d="M0 0v12h16V0z" clipRule="evenodd" />
                </mask>
                <g mask="url(#mask0_270_55029)">
                    <path
                        fill="#E31D1C"
                        fillRule="evenodd"
                        d="M8 9.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5"
                        clipRule="evenodd"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_270_55029">
                    <path fill="#fff" d="M0 0h16v12H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}
