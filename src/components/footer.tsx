
export default function Footer() {
  return (
    <footer className={`mt-8 text-center text-muted-foreground`}>
      Acme corp. &copy; {new Date().getFullYear()}
    </footer>
  )
}