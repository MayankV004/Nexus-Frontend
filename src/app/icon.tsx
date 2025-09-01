import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Nexus'
export const size = {
  width: 512,
  height: 512,
}
 
export const contentType = 'image/png'
 
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 256,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50px',
        }}
      >
        ⚡
      </div>
    ),
    {
      ...size,
    }
  )
}
