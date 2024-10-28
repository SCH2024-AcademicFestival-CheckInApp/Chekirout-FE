export const Stamp = ({ size = 50 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="27.5" cy="27.5" r="27.5" fill="#235698"/>
        <circle cx="27.5" cy="27.5" r="25" stroke="white" strokeWidth="1"/>
        <path d="M19.5 27.5L24.5 32.5L35.5 21.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const EmptyStamp = ({ size = 50 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="27.5" cy="27.5" r="25.5" fill="white" />
    </svg>
);

