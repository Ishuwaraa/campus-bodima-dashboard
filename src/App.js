import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import AdApproval from './pages/adApproval';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthProvider';
import Users from './pages/users';
import Profile from './pages/profile';
import ForgotPass from './pages/forgotPass';
import ResetPass from './pages/resetPass';
import ErrorPage from './pages/404';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<PrivateRoute element={<Home />} />}/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<PrivateRoute element={<Register />} />} />
          <Route path='/ad-approve' element={<PrivateRoute element={<AdApproval />} />} />
          <Route path='/users' element={<PrivateRoute element={<Users />} />} />
          <Route path='/profile' element={<PrivateRoute element={<Profile />} />} />
          <Route path='/forgot-password' element={<ForgotPass />} />
          <Route path='/reset-password' element={<ResetPass />} />

          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
