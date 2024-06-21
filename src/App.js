import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import AdApproval from './pages/adApproval';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PrivateRoute element={<Home />} />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<PrivateRoute element={<Register />} />} />
        {/* <Route path='/register' element={<Register />}/> */}
        <Route path='/ad-approve' element={<PrivateRoute element={<AdApproval />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;