import TopOfTheDaySection from "../components/TopOfTheDaySection";
import StakeModal from "../components/StakeModal";
import Assets from "../components/Assets";
import Loader from "../components/Loader";
import React from "react";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Nav from "../components/Nav";

const Main: React.FC = () => {
    const { loading } = useSelector((state: RootState) => state.coins);
    return (
        <div className="min-h-screen">
            <ToastContainer
                position="top-center"
                style={{ width: "max-content" }}
            />
            <div className="bg-black pb-20">
                <Nav />
                <div className="lg:w-11/12 mx-auto p-4">
                    <h1 className="font-bold text-2xl text-white">
                        {" "}
                        Daily Overview
                    </h1>
                </div>
            </div>
            <TopOfTheDaySection />
            <StakeModal />
            <div className="lg:w-11/12 mx-auto px-4">
                <div className="w-full py-6">
                    <div className="flex flex-col gap-2 rounded-md shadow-md bg-white p-6">
                        {loading ? <Loader /> : <Assets />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
