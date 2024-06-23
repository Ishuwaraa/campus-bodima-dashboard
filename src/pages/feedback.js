import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { errorNotify } from "../toastify/notifi";

const Feedback = () => {    
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [errMessage, setErrMessage] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axiosPrivate.get('/api/feedback/');
                setFeedbacks(response.data);
                setErrMessage(null);
            } catch (err) {
                if(err.response.status === 401) {
                    //no refresh token
                    console.log(err.response.data.msg);
                    localStorage.removeItem('auth');
                    errorNotify('Your session has expired. Please log in again to continue.')
                    navigate('/login', {  replace: true });
                } else if(err.response.status === 403) {
                    console.log(err.response.data.error);
                    setErrMessage(err.response.data.error);
                } else {
                    console.log(err.message);
                    setErrMessage(err.message);
                }
            }
        }

        fetchData();
    }, [])

    return ( 
        <div>
            <Navbar />
            
            <div className="page">
                {errMessage? (
                    <p className=" text-lg text-cusGray flex justify-center">{errMessage}</p>
                ) : (                          
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th  className="px-6 py-3">Rating</th>
                                    <th  className="px-6 py-3">Feedback</th>
                                    <th  className="px-6 py-3">Date added</th>
                                </tr>
                            </thead>

                            {feedbacks.length > 0 && 
                            <tbody>
                                {feedbacks.map((feedback, index) => {
                                    const date = new Date(feedback.createdAt);

                                    return (
                                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td  className="px-6 py-4 dark:text-white">{feedback.rating}</td>
                                            <td className="px-6 py-4 dark:text-white">{feedback.feedback}</td>
                                            <td className="px-6 py-4 dark:text-white">{date.toLocaleDateString()}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>                            
                            }
                        </table>
                    </div>
                )}    
            </div>

            <Footer />
        </div>
     );
}
 
export default Feedback;