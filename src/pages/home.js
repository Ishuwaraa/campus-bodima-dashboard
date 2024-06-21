import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SkeltionAdCard from '../components/AdSkeltonCard';
import AdDetail from '../components/AdDetail';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(false);
    const [ads, setAds] = useState([]);
    const [errMessage, setErrMessage] = useState(null);
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            try{
                setLoading(true);
                const response = await axiosPrivate.get('/api/admin/all-ads');

                const adsWithImages = response.data.ads.map((ad, index) => ({
                    ...ad,
                    imageUrl: response.data.imageUrls[index]
                }));
                setAds(adsWithImages);
                setLoading(false);
                setErrMessage(false);
            } catch(err) {
                setLoading(false);
                console.log(err.message);
                setErrMessage(true);
            }
        }

        fetchAds();
    }, [])

    return ( 
        <div>
            <Navbar />

            <div className="page">
                {
                loading? (
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {Array(3).fill(0).map((_, index) => (
                                <SkeltionAdCard key={index}/>
                            ))}
                        </div>
                    </div>
                ) : 
                errMessage? (
                    <div className=" flex justify-center">
                        <p className=" text-cusGray text-lg">{errMessage}</p>
                    </div>
                ) : (
                    <div>
                        <div className=" mt-14 lg:mt-20 mb-10 flex justify-between">
                            <p className="text-2xl md:text-4xl text-primary font-bold">All Ads</p>
                            <select name="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className=" p-1 border border-cusGray rounded-lg">
                                <option value="" className=" text-gray-500">Sort by</option>
                                <option value="approved" >Approved ads</option>
                                <option value="pending" >Pending ads</option>
                                <option value="denied" >Denied ads</option>
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {ads.length > 0 && 
                                ads.map((ad, index) => (
                                    <a href={`/ad-approve?id=${ad._id}`} key={index}>
                                        <AdDetail 
                                            image={ad.imageUrl} 
                                            title={ad.title} 
                                            location={ad.location}
                                            price={ad.price}
                                            rate={ad.rating}                  
                                        />
                                    </a> 
                                ))
                            }
                            </div>
                        </div>
                    </div>
                )}                
            </div>

            <Footer />
        </div>
     );
}
 
export default Home;