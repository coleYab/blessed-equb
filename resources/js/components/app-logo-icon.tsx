import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg 
            {...props} 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main Hexagonal Container */}
            <path 
                d="M20 2L36 11V29L20 38L4 29V11L20 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinejoin="round" 
            />
            
            {/* Mirror 'B' Structure representing Community & Unity */}
            <path 
                d="M18.5 8V32M18.5 8H14.5L10 11V18.5L14.5 21.5H18.5M18.5 21.5H14.5L10 24.5V32H18.5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            
            <path 
                d="M21.5 8V32M21.5 8H25.5L30 11V18.5L25.5 21.5H21.5M21.5 21.5H25.5L30 24.5V26" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />

            {/* The Blessed Sparkle at the top center */}
            <path 
                d="M20 6L21 8L20 10L19 8L20 6Z" 
                fill="#FFD700" 
            />

            {/* The Prosperity Coin (Gold Accent) */}
            <circle 
                cx="31" 
                cy="29" 
                r="4.5" 
                fill="#FFD700" 
            />
            <circle 
                cx="31" 
                cy="29" 
                r="4.5" 
                stroke="currentColor" 
                strokeWidth="1"
            />
        </svg>
    );
}