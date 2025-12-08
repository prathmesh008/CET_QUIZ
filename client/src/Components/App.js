import '../Styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Main from './Main';
import Quiz from './Quiz';
import Result from './Result';
import ResultDetails from './ResultDetails';
import QuizSelection from './QuizSelection';
import { CheckUserExist } from '../Helper/Helper';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>
  },
  {
    path: "/select-quiz",
    element: <CheckUserExist><QuizSelection /></CheckUserExist>
  },
  {
    path: "/quiz",
    element: <CheckUserExist><Quiz /></CheckUserExist>
  },
  {
    path: "/result",
    element: <CheckUserExist><Result /></CheckUserExist>
  },
  {
    path: "/result-details",
    element: <CheckUserExist><ResultDetails /></CheckUserExist>
  },
])
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
