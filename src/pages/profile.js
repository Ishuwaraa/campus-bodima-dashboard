import { useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { notify, errorNotify } from '../toastify/notifi';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const Profile = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [loading, setLoading] = useState(false);
    const [skeletonLoad, setSkeletonLoad] = useState(false);
    const [errMessage, setErrMessage] = useState(null);
    const [formErrMsg, setFormErrMsg] = useState(null);

    const [activeForm, setActiveForm] = useState('profile');
    const [activeLink, setActiveLink] = useState('profile');
    const onActiveFormClick = (type) => {
        setActiveForm(type);
        setActiveLink(type);
    }

    //data form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();

    //edit form
    const editName = watch('editName');
    const editEmail = watch('editEmail');
    const editPhone = watch('editPhone');
    
    //pass form
    const currPass = watch('currPass');
    const newPass = watch('newPass');
    const conPass = watch('conPass');
    
    //delete form
    const delPass = watch('delPass');

    const fetchUserData = async () => {
        try{
            setSkeletonLoad(true);
            const response = await axiosPrivate.get('/api/admin/');
            setSkeletonLoad(false);
            setName(response.data.name || '');
            setEmail(response.data.email || '');
            setPhone(response.data.contact || '');
            setValue('editName', response.data.name || '');
            setValue('editEmail', response.data.email || '');
            setValue('editPhone', response.data.contact || '');
            setErrMessage(null);
            setFormErrMsg(null);
        } catch (err) {
            setSkeletonLoad(false);
            if(err.response.status === 400) console.log(err.response.data.msg);
            else if(err.response.status === 401) {
                //no refresh token
                console.log(err.response.data.msg);
                localStorage.removeItem('auth');
                errorNotify('Your session has expired. Please log in again to continue.')
                navigate('/login', { state: { from: location }, replace: true });
            }
            else if(err.response.status === 403) console.log(err.response.data.msg);
            else if(err.response.status === 404) console.log(err.response.data.msg);
            else {
                console.log(err.message);
                setErrMessage(err.message);
            }
        }
    }           
    useEffect(() => {  
        fetchUserData();
    }, [])
    
    const onSubmit = async (type) => {
        if(type === 'edit') {
            const formData = { editName, editEmail, editPhone };
            try{
                const response = await axiosPrivate.patch('/api/admin/update', formData);              
                fetchUserData();
                notify('Profile updated successfully!');
            } catch (err) {
                if (err.response.status === 400) console.log(err.response.data.msg);
                else if(err.response.status === 401){
                    //no refresh token
                    console.log(err.response.data.msg);
                    localStorage.removeItem('auth');
                    errorNotify('Your session has expired. Please log in again to continue.')
                    navigate('/login', { state: { from: location }, replace: true });
                }
                else if(err.response.status === 403) console.log(err.response.data.msg);
                else console.log(err.message);
            }

        } else if( type === 'pass') {
            if(newPass !== conPass) {
                setFormErrMsg("Passwords doesn't match");
                return
            }

            const formData = { currPass, newPass };
            try{
                setSkeletonLoad(true);
                const response = await axiosPrivate.patch('/api/admin/update-pass', formData);
                setSkeletonLoad(false);
                notify(response.data.msg);
                localStorage.removeItem('auth');
                navigate('/login', { replace: true });
                setErrMessage(null);
                setFormErrMsg(null);
            } catch (err) {
                setSkeletonLoad(false);
                if(err.response.status === 400){
                    setFormErrMsg(err.response.data.msg);
                }else if(err.response.status === 401){
                    //no refresh token
                    console.log(err.response.data.msg);
                    localStorage.removeItem('auth');
                    errorNotify('Your session has expired. Please log in again to continue.')
                    navigate('/login', { state: { from: location }, replace: true });
                } 
                else if(err.response.status === 403) console.log(err.response.data.msg);
                else if(err.response.status === 404) {
                    console.log(err.response.data.msg);
                    setFormErrMsg(err.response.data.msg);
                }
                else console.log(err.message);
            }
        } else if(type === 'del') { 
            if(window.confirm('Are you sure you want to delete this account?')){
                try{
                    setLoading(true);
                    const response = await axiosPrivate.post('/api/admin/del', { delPass });
                    setLoading(false);
                    localStorage.removeItem('auth');
                    notify(response.data.msg);
                    navigate('/login', { replace: true })
                } catch (err) {
                    setLoading(false);
                    if(err.response.status === 400){
                        setFormErrMsg(err.response.data.msg);
                    }else if(err.response.status === 401){
                        //no refresh token
                        console.log(err.response.data.msg);
                        localStorage.removeItem('auth');
                        errorNotify('Your session has expired. Please log in again to continue.')
                        navigate('/login', { state: { from: location }, replace: true });
                    } 
                    else if(err.response.status === 403) console.log(err.response.data.msg);
                    else if(err.response.status === 404) console.log(err.response.data.msg);
                    else if(err.response.status === 500) setErrMessage(err.response.data.msg);
                    else console.log(err.message);
                }
            }
        }
    }    

    return(
        <div>
            <Navbar />

                {errMessage? (
                    <p className=" flex justify-center text-cusGray">{errMessage}</p>
                ) : loading? (
                    <Loading />
                ) : (
                <>
                <div className="page">

                    <p className=" mb-8 text-2xl md:text-4xl text-primary font-bold">My Profile</p>
                    <div className=" flex flex-col md:grid md:grid-cols-3 gap-10 lg:gap-20">
                        {skeletonLoad? (
                            <>
                                <div className=" col-span-1 h-48"><Skeleton className=" h-full"/></div>
                                <div className=" col-span-2 h-48"><Skeleton className=" h-full"/></div>
                            </>
                        ) : (
                            <>
                            <div className=" col-span-1 border border-cusGray rounded-lg md:h-64">
                                <div className=" grid grid-cols-2 gap-5 md:gap-8 md:flex md:flex-col px-10 py-8">
                                    <p onClick={() => onActiveFormClick('profile')} className={` ${activeLink === 'profile'? 'text-secondary' : 'text-cusGray'} font-semibold hover:cursor-pointer hover:underline`}>Profile</p>
                                    <p onClick={() => onActiveFormClick('edit')} className={` ${activeLink === 'edit'? 'text-secondary' : 'text-cusGray'} font-semibold hover:cursor-pointer hover:underline`}>Edit Profile</p>
                                    <p onClick={() => onActiveFormClick('pass')} className={` ${activeLink === 'pass'? 'text-secondary' : 'text-cusGray'} font-semibold hover:cursor-pointer hover:underline`}>Change Password</p>
                                    <p onClick={() => onActiveFormClick('delete')} className={` ${activeLink === 'delete'? 'text-secondary' : 'text-cusGray'} font-semibold hover:cursor-pointer hover:underline`}>Delete Account</p>
                                </div>
                            </div>
        
                            <div className=" col-span-2 border border-cusGray rounded-lg">
                                <div className=" px-10 py-8">
                                    {activeForm === 'profile' && 
                                        <form action="" >
                                            <p className=" mb-1 w-full text-secondary font-semibold">Name</p>
                                            <input type="text" className="input" readOnly value={name}/>
                                            <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Email</p>
                                            <input type="email" className="input" readOnly value={email}/>
                                            <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Contact</p>
                                            <input type="text" className="input" readOnly value={phone}/>                                    
                                        </form>
                                    }
        
                                    {activeForm === 'edit' &&
                                        <form action="" onSubmit={handleSubmit(() => onSubmit('edit'))}>
                                            <p className=" mb-1 w-full text-secondary font-semibold">Name</p>
                                            <input type="text" className="input" required placeholder="John Doyle"
                                            {...register('editName', { maxLength: 100, pattern: /^[A-Za-z\s]+$/i })}/>
                                            {errors.editName && errors.editName.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.editName && <span className=' text-sm text-red-600'>enter only letters</span> }
                                            <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Email</p>
                                            <input type="email" className="input" required placeholder="johndoyle@gmail.com"
                                            {...register('editEmail', { maxLength: 100 })}/>
                                            {errors.editEmail && <span className=' text-sm text-red-600'>max character limit is 100</span>}
                                            <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Contact</p>
                                            <input type="text" className="input" required placeholder="0712567345"
                                            {...register('editPhone', { maxLength: 10, pattern: /^\d{1,10}$/})}/>
                                            {errors.editPhone && errors.editPhone.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.editPhone && <span className=' text-sm text-red-600'>enter only numbers from 0-9</span> }
        
                                            <div className=" flex justify-end mt-8">
                                                <button className=" btn bg-primary"> Save changes</button>
                                            </div>
                                        </form>
                                    }
        
                                    {activeForm === 'pass' &&
                                        <form action="" onSubmit={handleSubmit(() => onSubmit('pass'))}>
                                            <p className=" mb-1 w-full text-secondary font-semibold">Current password</p>
                                            <input type="password" className="input" required
                                            {...register('currPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                                            {errors.currPass && errors.currPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 15</span> : 
                                            errors.currPass && errors.currPass.type === 'minLength' ? <span className=' text-sm text-red-600'>min character limit is 8</span> :
                                            errors.currPass && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}
        
                                            <p className=" mt-3 mb-1 w-full text-secondary font-semibold">New password</p>
                                            <input type="password" className="input" required
                                            {...register('newPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                                            {errors.newPass && errors.newPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 15</span> : 
                                            errors.newPass && errors.newPass.type === 'minLength' ? <span className=' text-sm text-red-600'>min character limit is 8</span> :
                                            errors.newPass && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}
        
                                            <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Confirm password</p>
                                            <input type="password" className="input" required
                                            {...register('conPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                                            {errors.conPass && errors.conPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 15</span> : 
                                            errors.conPass && errors.conPass.type === 'minLength' ? <span className=' text-sm text-red-600'>min character limit is 8</span> :
                                            errors.conPass && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}
                                            <p className=" mt-1 text-sm text-red-600">note: You will be logged out after changing your password</p>
        
                                            {formErrMsg && <p className=" mt-1 text-sm text-red-600">{formErrMsg}</p>}
                                            <div className=" flex justify-end mt-8">
                                                <button className=" btn bg-primary"> Update password</button>
                                            </div>
                                        </form>
                                    }
        
                                    {activeForm === 'delete' &&
                                        <form action="" onSubmit={handleSubmit(() => onSubmit('del'))}>
                                            <p className=" mb-1 w-full text-secondary font-semibold">Current password</p>
                                            <input type="password" className="input" required
                                            {...register('delPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                                            {errors.delPass && errors.delPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 15</span> : 
                                            errors.delPass && errors.delPass.type === 'minLength' ? <span className=' text-sm text-red-600'>min character limit is 15</span> :
                                            errors.delPass && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}
        
                                            {formErrMsg && <p className=" mt-1 text-sm text-red-600">{formErrMsg}</p>}
                                            <div className=" flex justify-end mt-8">
                                                <button className=" btn bg-red-500"> Delete account</button>
                                            </div>
                                        </form>
                                    }
                                </div>
                            </div>                            
                            </>
                        )}
                    </div>                    
                </div>

                <Footer />
                </>
                )}
        </div>
    )
}

export default Profile;