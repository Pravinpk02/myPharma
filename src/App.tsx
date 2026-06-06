import './App.css';
import { AppearanceProvider } from './context/AppearanceContext';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AppearanceProvider>
  );
}

export default App;
