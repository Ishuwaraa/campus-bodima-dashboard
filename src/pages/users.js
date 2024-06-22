import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { errorNotify } from "../toastify/notifi";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [errMessage, setErrMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axiosPrivate.get('/api/admin/users');

                setUsers(response.data.names.map((name, index) => {
                    const date = new Date(response.data.createdDate[index]);

                    return {
                    name: name,
                    email: response.data.emails[index],
                    contact: response.data.contacts[index],
                    date : date.toLocaleDateString()
                }}));
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
                    <>
                    <p className=" flex justify-center mb-10 text-2xl font-bold">USER COUNT : {users.length}</p>                                

                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th  className="px-6 py-3">Email</th>
                                    <th  className="px-6 py-3">Name</th>
                                    <th  className="px-6 py-3">Contact</th>
                                    <th  className="px-6 py-3">Date joined</th>
                                    <th  className="px-6 py-3">Action</th>
                                </tr>
                            </thead>

                            {users.length > 0 && 
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td  className="px-6 py-4 whitespace-nowrap dark:text-white">{user.email}</td>
                                        <td className="px-6 py-4 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 dark:text-white">0{user.contact}</td>
                                        <td className="px-6 py-4 dark:text-white">{user.date}</td>
                                        <td className="px-6 py-4 dark:text-white"><a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">view</a></td>
                                    </tr>
                                ))}
                            </tbody>                            
                            }
                        </table>
                    </div>
                    </>
                )}                
            </div>

            <Footer />
        </div>
    )
}

export default Users;