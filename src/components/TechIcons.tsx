import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const PythonIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M63.58 4.08c-30.82 0-28.9 13.38-28.9 13.38l.03 13.88h29.4v4.17H21.57C8.13 35.51 0 43.6 0 57.06c0 13.47 7.42 21.05 21.57 21.05h12.83v-17.7c0-9.84 8.52-18.06 18.9-18.06h29.35c8.38 0 15.22-6.9 15.22-15.35V20.85c0-8.45-7.06-16.77-14.29-16.77zm-14.7 9.45a4.34 4.34 0 1 1 0 8.68 4.34 4.34 0 0 1 0-8.68z"
      fill="#3776AB"
    />
    <path
      d="M64.42 123.92c30.82 0 28.9-13.38 28.9-13.38l-.03-13.88h-29.4v-4.17h42.54c13.44 0 21.57-8.09 21.57-21.55 0-13.47-7.42-21.05-21.57-21.05H93.6v17.7c0 9.84-8.52 18.06-18.9 18.06H45.35c-8.38 0-15.22 6.9-15.22 15.35v16.15c0 8.45 7.06 16.77 14.29 16.77zm14.7-9.45a4.34 4.34 0 1 1 0-8.68 4.34 4.34 0 0 1 0 8.68z"
      fill="#FFD43B"
    />
  </svg>
);

export const CIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M116.18 84.7c-7.9 15.9-23.7 26.6-42.6 26.6-26.1 0-47.3-21.2-47.3-47.3s21.2-47.3 47.3-47.3c18.8 0 34.6 10.7 42.6 26.6l18.5-9.3C122.9 12.3 97.4 0 68.6 0 30.7 0 0 30.7 0 68.6s30.7 68.6 68.6 68.6c28.8 0 54.3-12.3 66.1-33.3l-18.5-9.2z"
      fill="#00599C"
    />
    <path
      d="M116.2 43.3l-18.5 9.3c-7.9-15.9-23.8-26.6-42.6-26.6-26.1 0-47.3 21.2-47.3 47.3s21.2 47.3 47.3 47.3c18.8 0 34.7-10.7 42.6-26.6l18.5 9.2c-11.8 21-37.3 33.3-66.1 33.3C30.7 137.2 0 106.5 0 68.6S30.7 0 68.6 0c28.8 0 54.3 12.3 66.1 33.3z"
      fill="#659AD2"
      fillOpacity="0.3"
    />
  </svg>
);

export const GitIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M124.71 56.49 71.51 3.29a10.6 10.6 0 0 0-15 0L42.67 17.15l18.96 18.96a12.6 12.6 0 0 1 15.91 15.98l18.27 18.27a12.6 12.6 0 0 1 12.98 20.73 12.6 12.6 0 0 1-20.73-12.97l-17-17-.06 43.76a12.6 12.6 0 1 1-10.61 0l.06-44.88a12.6 12.6 0 0 1-6.79-16.54L35.21 24.61 3.29 56.53a10.6 10.6 0 0 0 0 15l53.2 53.2a10.6 10.6 0 0 0 15 0l53.22-53.24a10.6 10.6 0 0 0 0-15z"
      fill="#F05032"
    />
  </svg>
);

export const VSCodeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M93.38 1.47a7.6 7.6 0 0 0-7.85 1.54L34.1 48.06 14.7 33.32a6.34 6.34 0 0 0-7.6.24L1.75 38.3a6.34 6.34 0 0 0-.25 9.38l22.28 20.3-22.28 20.3a6.34 6.34 0 0 0 .25 9.38l5.35 4.74a6.34 6.34 0 0 0 7.6.24l19.4-14.74 51.43 45.05a7.6 7.6 0 0 0 7.85 1.54 7.6 7.6 0 0 0 4.67-7.04V8.51a7.6 7.6 0 0 0-4.67-7.04z"
      fill="#007ACC"
    />
    <path
      d="M93.38 1.47a7.6 7.6 0 0 0-7.85 1.54L34.1 48.06l24.47 19.92 39.93-34.98V8.51a7.6 7.6 0 0 0-4.67-7.04z"
      fill="#1F9CF0"
    />
    <path
      d="M98.5 95V33l-39.93 35z"
      fill="#0066B8"
    />
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 98 96"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
    />
  </svg>
);

export const CS50Icon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M60 4C29.07 4 4 29.07 4 60c0 30.93 25.07 56 56 56s56-25.07 56-56C116 29.07 90.93 4 60 4z"
      fill="#A51C30"
    />
    <path
      d="M32 42h56v10H32zm0 18h56v10H32zm0 18h36v10H32z"
      fill="#FFFFFF"
    />
    <text
      x="60"
      y="76"
      textAnchor="middle"
      fontSize="24"
      fontWeight="900"
      fontFamily="monospace"
      fill="#FFFFFF"
    >
      CS50
    </text>
  </svg>
);

export const LinuxBashIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <rect width="128" height="128" rx="24" fill="#29313D" />
    <path
      d="M26 40l28 24-28 24M68 88h34"
      stroke="#4EAA25"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
