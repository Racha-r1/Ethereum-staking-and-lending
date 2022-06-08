import React from "react";
import Nav from "../components/Nav";
import logo from "../images/logo.png";
import Button from "@mui/material/Button";

const Rewards: React.FC = () => {
    return (
        <div className="min-h-screen">
            <div className="bg-black pb-20">
                <Nav />
                <div className="lg:w-11/12 mx-auto p-4">
                    <h1 className="font-bold text-2xl text-white"> Rewards</h1>
                </div>
            </div>
            <div className="lg:w-11/12 mx-auto px-4 flex flex-wrap gap-5 relative bottom-10">
                <div className="rounded-md shadow-md bg-white p-6 w-full">
                    <div className="flex gap-4 items-center mb-10">
                        <img
                            src={logo}
                            alt="logo"
                            className="w-12 h-12 rounded-full"
                        />
                        <h1>
                            {" "}
                            You have not earned any rewards yet, be sure to
                            stake in order to get the DPK token as a staking
                            reward. <br />
                            See if you can claim rewards by pressing the button below.
                        </h1>
                    </div>
                    <Button variant="outlined"> Claim rewards </Button>
                </div>
            </div>
        </div>
    );
};

export default Rewards;
