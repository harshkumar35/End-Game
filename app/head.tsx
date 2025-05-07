export default function Head() {
  return (
    <>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        defer
        onError={(e) => {
          console.error("Error loading GSAP:", e)
        }}
      />
    </>
  )
}
