import React from 'react';

interface DecorativeLinesProps {
    variant?: 'hero' | 'section' | 'footer';
    className?: string;
}

const DecorativeLines: React.FC<DecorativeLinesProps> = ({
    variant = 'section',
    className = '',
}) => {
    if (variant === 'hero') {
        return (
            <svg
                className={className}
                viewBox="0 0 800 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M0 200 Q 200 150, 400 200 T 800 200"
                    stroke="var(--color-lilac-soft)"
                    strokeWidth="1"
                    opacity="0.6"
                />
                <path
                    d="M0 220 Q 250 180, 500 220 T 800 220"
                    stroke="var(--color-sky-soft)"
                    strokeWidth="1"
                    opacity="0.5"
                />
                <circle
                    cx="150"
                    cy="180"
                    r="3"
                    fill="var(--color-lilac-medium)"
                    opacity="0.4"
                />
                <circle
                    cx="650"
                    cy="210"
                    r="2"
                    fill="var(--color-sky-medium)"
                    opacity="0.4"
                />
            </svg>
        );
    }

    if (variant === 'section') {
        return (
            <svg
                className={className}
                viewBox="0 0 600 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M0 50 Q 150 30, 300 50 T 600 50"
                    stroke="var(--color-sand-medium)"
                    strokeWidth="0.8"
                    opacity="0.5"
                />
                <path
                    d="M50 60 Q 200 45, 350 60 T 600 60"
                    stroke="var(--color-lilac-soft)"
                    strokeWidth="0.8"
                    opacity="0.4"
                />
            </svg>
        );
    }

    return (
        <svg
            className={className}
            viewBox="0 0 800 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M0 100 Q 200 80, 400 100 T 800 100"
                stroke="var(--color-sky-soft)"
                strokeWidth="1"
                opacity="0.5"
            />
            <circle
                cx="400"
                cy="100"
                r="2"
                fill="var(--color-ochre)"
                opacity="0.5"
            />
        </svg>
    );
};

export default DecorativeLines;

