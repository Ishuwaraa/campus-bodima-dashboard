import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Detail from "../components/Detail";
import gender from '../assets/ad/gender.png';
import Bed from "../assets/ad/bed.png";
import shower from '../assets/ad/shower.png'
import Phone from "../assets/ad/phone.png";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { notify, errorNotify } from '../toastify/notifi';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import Loading from "../components/Loading";

const AdApproval = () => {
    const axiosPrivate = useAxiosPrivate();

    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();
    const emailMsg = watch("emailMsg");  

    const [adDetails, setAdDetails] = useState([]);
    const [username, setUsername] = useState(null);
    const [useremail, setUseremail] = useState(null);
    const [adRating, setAdRating] = useState(null);
    const [skeleteonLoad, setSkeletonLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [adDate, setAdDate] = useState('');
    const [errMessage, setErrMessage] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);  

    //image slider
    const [currentIndex, setcurrentIndex] = useState(0);

    const nextSlide = () => setcurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    const prevSlide = () => setcurrentIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
    const goToSlide = (index) => setcurrentIndex(index);

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const adId = searchParams.get('id');

    //map
    const position = (lat === null || long === null) ? {lat: 6.884504262718018, lng: 79.91861383804526} : {lat: lat, lng: long};

    const fetchData = async () => {
        try{
            if(adId === '') return navigate('/');

            setSkeletonLoad(true);
            const response = await axiosPrivate.get(`/api/admin/ad/${adId}`);

            setAdDetails(response.data.ad);
            setImageUrls(response.data.imageUrls);
            setUsername(response.data.username);
            setUseremail(response.data.useremail);
            setAdRating(response.data.ad.rating);
            setLat(response.data.ad.latitude);
            setLong(response.data.ad.longitude);    
            
            const date = response.data.ad.createdAt;
            const formatted = new Date(date);
            setAdDate(formatted.toLocaleDateString())

            setErrMessage(null);      
            setSkeletonLoad(false);
        }catch(err) {
            setSkeletonLoad(false);
            if(err.response) {
                console.log(err.response.data);
                setErrMessage(err.response.data.msg);
            } else if(err.request) {
                console.log(err.request);
            } else {
                console.log(err.message);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);  

    const onSubmit = async () => {
        const formData = {
            status : 'approved',
            emailMsg,
            emailSubject: `Your ad '${adDetails.title}' is now live`
        }

        try{
            setLoading(true);
            const response = await axiosPrivate.patch(`/api/admin/update-ad/${adId}`, formData);
            setLoading(false);
            setValue('emailMsg', '');
            fetchData();
            notify('Status updated and email sent successfully.');
        } catch (err) {
            setLoading(false);
            if(err.response.status === 401) {
                //no refresh token
                console.log(err.response.data.msg);
                localStorage.removeItem('auth');
                errorNotify('Your session has expired. Please log in again to continue.')
                navigate('/login', {  replace: true });
            }
            else if(err.response.status === 403) console.log(err.response.data.error);
            else if(err.response.status === 404) {
                console.log(err.response.data.msg);
                setErrMessage(err.response.data.msg);
            }
            else {
                console.log(err.message);
                setErrMessage(err.message);
            }
        }
    }

    const denyApprove = async (e) => {
        e.preventDefault();

        const formData = {
            status : 'denied',
            emailMsg,
            emailSubject: `Your ad '${adDetails.title}' has been denied`
        }

        try{
            setLoading(true);
            const response = await axiosPrivate.patch(`/api/admin/update-ad/${adId}`, formData);
            setLoading(false);
            fetchData();
            setValue('emailMsg', '');
            notify('Status updated and email sent successfully.');
        } catch (err) {
            setLoading(false);
            if(err.response.status === 401) {
                //no refresh token
                console.log(err.response.data.msg);
                localStorage.removeItem('auth');
                errorNotify('Your session has expired. Please log in again to continue.')
                navigate('/login', {  replace: true });
            }
            else if(err.response.status === 403) console.log(err.response.data.error);
            else if(err.response.status === 404) {
                console.log(err.response.data.msg);
                setErrMessage(err.response.data.msg);
            }
            else {
                console.log(err.message);
                setErrMessage(err.message);
            }
        }
    }

    const deleteAd = async (e) => {
        e.preventDefault();
        if(emailMsg === '') {
            errorNotify('Email content is required');
            return;
        }

        if(window.confirm('Are you sure you want to delete this ad?')) {
            try{
                setLoading(true);
                const response = await axiosPrivate.post(`/api/admin/delete-ad/${adId}`, { emailMsg });
                notify(response.data.msg);
                navigate('/', { replace: true });
                setLoading(false);
            } catch (err) {
                setLoading(false);
                if(err.response.status === 401) {
                    //no refresh token
                    console.log(err.response.data.msg);
                    localStorage.removeItem('auth');
                    errorNotify('Your session has expired. Please log in again to continue.')
                    navigate('/login', {  replace: true });
                }
                else if(err.response.status === 403) console.log(err.response.data.error);
                else if(err.response.status === 404) {
                    console.log(err.response.data.msg);
                    setErrMessage(err.response.data.msg);
                }
                else {
                    console.log(err.message);
                    setErrMessage(err.message);
                }
            }
        }
    }

    return (
        <div>
        <Navbar />

        {loading? (
            <Loading />
        ) : (
            <>
            <div className="page">
                {errMessage? (
                <div className=" flex justify-center">
                    <p className=" text-cusGray text-lg">{errMessage}</p>
                </div>
                ) :
                <>      
                <div className=" ">
                    {skeleteonLoad? (
                    <Skeleton className=" w-full h-64" />
                    ) : (
                    <div className=" border border-primary rounded-lg md:w-full overflow-hidden relative  ">
                        <div className="absolute inset-0 bg-cover bg-center filter blur-md z-0" style={{ backgroundImage: `url(${imageUrls[currentIndex]})` }}></div>
                        <div className=" relative z-10 ">
                        <img src={imageUrls[currentIndex]} alt="ad title" className="w-full h-72 md:h-96 object-contain transition-transform duration-500 ease-in-out"/>
                        </div>
                        
                        <button onClick={prevSlide} className="z-20 absolute top-1/2 md:left-5 left-0 transform -translate-y-1/2 p-4 text-4xl md:text-5xl text-primary flex items-center justify-center">
                        <span>&#10094;</span>
                        </button>
                        <button onClick={nextSlide} className=" z-20 absolute top-1/2 md:right-5 right-0 transform -translate-y-1/2 p-4 text-4xl md:text-5xl text-primary flex items-center justify-center">
                        <span>&#10095;</span>
                        </button>

                        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {imageUrls.map((_, index) => (
                            <div key={index} className={`w-3 h-3 rounded-full ${ index === currentIndex ? "bg-gray-700" : "bg-gray-400"} cursor-pointer`}onClick={() => goToSlide(index)}/>
                        ))}
                        </div>
                    </div>
                    )}

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-10 my-10 ">
                    <div className="col-span-2  md:col-span-3">
                        {skeleteonLoad? (
                        <Skeleton count={4}/>
                        ) : (
                        <>
                        <p className=" text-xl text-cusGray font-semibold mb-2">Ad status : <span className=" text-primary">{adDetails.status}</span></p>
                        <p className=" text-2xl md:text-4xl font-bold mb-1">{adDetails.title}</p>
                        <p className="md:text-2xl text-gray-600">{adDetails.location}</p>
                        <p className="md:text-lg text-gray-600">{adDetails.university}</p>
                        <p className="text-lg md:text-3xl font-bold text-secondary">Rs. {adDetails.price}/mo</p>   
                        <p className=" text-cusGray text-lg mt-4">Posted by {username && <span className=" text-black font-semibold">{username}</span>}</p>               
                        <p className=" text-cusGray">{useremail && useremail}</p>
                        </>
                        )}
                    </div>

                    <div className="flex flex-col space-y-5">
                        {skeleteonLoad? (
                        <Skeleton count={2} />
                        ) : (
                        <>
                        <div className="flex items-center justify-end space-x-3">
                            <p className="text-xl md:text-3xl font-semibold text-gray-600 pt-1">{adRating}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="md:size-10 size-6 text-primary">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <div className="flex items-center justify-end space-x-3 cursor-pointer">
                            <p className=" text-cusGray text-lg">{adDate}</p>
                        </div>
                        </>
                        )}
                    </div>
                    </div>
                </div>

                <div className=" grid grid-cols-2 md:grid-cols-4 gap-5">
                    {skeleteonLoad? (
                    Array(4).fill(0).map((_, index) => (
                        <Skeleton key={index} className=" h-10"/>
                    ))
                    ) : (
                    <>
                    <Detail name={adDetails.gender} image={gender} />

                    <Detail name={adDetails.bed} image={Bed} />

                    <Detail name={adDetails.bathroom} image={shower} />
                    
                    <Detail name={`0${adDetails.contact}`} image={Phone} />
                    </>
                    )}
                </div>

                <div className="mt-10 mb-20 md:text-xl text-lg text-justify ">
                    {skeleteonLoad? <Skeleton count={2} /> : <p>{adDetails.description}</p>}
                </div>          
                
                {skeleteonLoad? (
                    <Skeleton className=" h-64 mt-10"/>
                ) : (
                    <div className=" w-full h-96 border border-cusGray rounded-lg my-20 overflow-hidden">
                    <APIProvider apiKey={process.env.REACT_APP_MAP_KEY}>
                        <Map defaultCenter={position} defaultZoom={12} mapId={'bf51a910020fa25a'}>
                        <AdvancedMarker position={position} />
                        </Map>
                    </APIProvider>
                    </div> 
                )}

                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className=" lg:px-20 mb-10 md:mb-5">
                        <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Email content</p>
                        <textarea name="emailMsg" rows='4' required className=" p-2 w-full border border-cusGray rounded-lg" placeholder="type what to send to the client" 
                        {...register('emailMsg', {maxLength: 300, pattern: /^[a-zA-Z0-9\s\.,_&@'"?!\-]+$/i })}/>
                        {errors.emailMsg && errors.emailMsg.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 300</span> : errors.emailMsg && <span className=' text-sm text-red-600'>description must contain only letters, numbers, and characters(@ & ' " _ - , . ? !)</span>}                            
                    </div> 

                    <div className=" flex flex-col md:flex-row gap-y-6 md:gap-y-0 justify-between md:mx-20 lg:mx-48">
                        <button onClick={(e) => deleteAd(e)} className="btn bg-red-500">DELETE AD</button>
                        <button onClick={(e) => denyApprove(e)} className="btn bg-cusGray">DENY APPROVAL</button>
                        <button className="btn bg-secondary">APPROVE</button>
                    </div>
                </form>
                </>
                }
            </div>
            <Footer />
            </>
        )}
        </div>
    );
};

export default AdApproval;
