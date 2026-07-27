import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children
}) {

  return (
    <div className="flex">

      <Sidebar />

      <main
        className="
        flex-1
        p-8
      "
      >
        {children}
      </main>

    </div>
  );

}