import logo from '../assets/logo/campus_bodima.png';

const Footer = () => {
    return(
        <div className="bg-footerb text-ashGray pb-3 mt-20">
            <div className="flex flex-col md:grid md:grid-cols-4 text-lg md:text-base">
                
                <div className="  md:col-span-2 md:pl-20">
                    <div className="flex flex-col ">
                        <div className=' flex justify-center md:justify-start'>
                            <img src={logo} alt="campus bodima" className="  h-52 hover:cursor-pointer" onClick={() => window.location.href = '/'}/>
                        </div>
                    </div>
                </div>

                <div className=" flex items-center my-7 md:my-0 pl-8 md:pl-0">
                    <ul className=" space-y-1">
                        {/* <li className=" hover:cursor-pointer hover:underline"><a href="/allAds">All Ads</a></li> */}
                    </ul>
                </div>

                <div className=" flex items-center mb-3 md:my-0 pl-8 md:pl-0">
                    <ul>
                        <li className=" mb-2">Contact us</li>
                        <li className=" text-sm">cbodima@gmail.com</li>
                    </ul>
                </div>
            </div>

            <p className=" flex justify-center text-sm text-gray-400 mt-3">© 2024 Campus Bodima. All rights reserved.</p>
        </div>
    )
}

export default Footer;