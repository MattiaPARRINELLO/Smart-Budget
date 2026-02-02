import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 16, height: 16 }
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
          borderRadius: '3px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 6L4 11L14 16L24 11L14 6Z"
            fill="white"
            opacity="0.95"
          />
          <circle cx="21" cy="21" r="5" fill="#fbbf24"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
