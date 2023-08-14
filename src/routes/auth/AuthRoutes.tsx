import {Route, Routes} from 'react-router-dom';
import Signin from "../../components/authentication/Signin";
import Signup from "../../components/authentication/Signup";

const AuthRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<Signin/>}/>
    </Routes>
  );
};

export default AuthRoutes;
