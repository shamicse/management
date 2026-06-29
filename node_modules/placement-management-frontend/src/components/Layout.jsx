import Navbar from './Navbar';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className="page">
      <div className="container">{children}</div>
    </main>
  </>
);

export default Layout;
