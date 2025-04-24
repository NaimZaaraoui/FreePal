import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

const BaseLayout = () => {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-white via-bg-secondary to-white relative overflow-hidden">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 mask-fade-out pointer-events-none" />

      {/* Color accents */}
      <div
        className="absolute top-0 left-0 -translate-x-1/2 aspect-square w-[50vw] rounded-full 
                    bg-gradient-to-br from-primary-light/20 to-secondary-light/20 blur-3xl"
      />
      <div
        className="absolute top-1/3 right-0 translate-x-1/2 aspect-square w-[40vw] rounded-full 
                    bg-gradient-to-bl from-secondary-light/10 to-primary-light/10 blur-3xl"
      />

      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative">
        <Outlet />
      </main>
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        className="!mt-20"
      />
    </div>
  );
};

export default BaseLayout;
