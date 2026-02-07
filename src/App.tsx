import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <Layout>
          <Home />
        </Layout>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;
