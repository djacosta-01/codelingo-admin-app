import QRCode from 'react-qr-code'

const QrCode = () => {
  return (
    <div className="qr-code-container">
      <QRCode value="Hey" />
      <h1>Testing public Nextjs route</h1>
      <div>Click the button below to navigate to Professor Gonzalez's website: </div>
      <button
        onClick={async () => {
          const response = await fetch('https://test-nextjs-app-eight-xi.vercel.app/test-route')
          if (response.redirected) {
            window.location.href = response.url // This will trigger a full-page redirect
          }
        }}
      >
        CLICK ME
      </button>
    </div>
  )
}

export default QrCode
