import { Link } from 'react-router-dom';

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <header>
      <h1>
        <Link to={'/'}>GPX Splitter</Link>
      </h1>
      <p>
        A tool for splitting GPX route files into several separate files, based either on the number of track points or
        distance.
      </p>
    </header>
    <section>{children}</section>
    <footer>
      <p>
        Created by <a href="https://github.com/GideonPARANOID">GideonPARANOID</a>. Source available on{' '}
        <a href="https://github.com/GideonPARANOID/gpx-splitter">GitHub</a>
      </p>
    </footer>
  </>
);

export default Page;
