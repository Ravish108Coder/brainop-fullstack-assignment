import {Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import PrivateRoutes from './components/PrivateRoutes'
import PublicRoutes from './components/PublicRoutes'
import NotFoundPage from './components/not-found/NotFound'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <ToastContainer />
      <Routes>
      <Route element={<PublicRoutes />}>
        <Route exact path='/signin' element={<SignIn />} />
        <Route exact path='/signup' element={<SignUp />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route exact path='/' element={<Home />} />
      </Route>
      <Route exact path='*' element={<NotFoundPage />} />
    </Routes>
    </>
  )
}

export default App