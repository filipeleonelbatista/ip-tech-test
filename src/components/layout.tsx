import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="w-full">
        {children}
      </div>
      <Footer />
    </>
  )
}