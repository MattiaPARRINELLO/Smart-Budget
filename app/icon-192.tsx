import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '32px',
        }}
      >
        <svg width="160" height="160" viewBox="0 0 28 28" fill="none">
          {/* Graduation cap */}
          <path
            d="M14 6L4 11L14 16L24 11L14 6Z"
            fill="white"
            opacity="0.95"
          />
          <path
            d="M8 12.5V17C8 18.66 10.69 20 14 20C17.31 20 20 18.66 20 17V12.5"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            fill="none"
            opacity="0.95"
          />
          {/* Dollar coin */}
          <circle cx="21" cy="21" r="5" fill="#fbbf24"/>
          <path
            d="M21 18.5V23.5M21 18.5C20 18.5 19.5 19 19.5 19.8M21 18.5C22 18.5 22.5 19 22.5 19.8M21 23.5C20 23.5 19.5 23 19.5 22.2M21 23.5C22 23.5 22.5 23 22.5 22.2M19.5 21C19.5 21.8 20 22.2 21 22.2C22 22.2 22.5 21.8 22.5 21C22.5 20.2 22 19.8 21 19.8C20 19.8 19.5 20.2 19.5 21Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
