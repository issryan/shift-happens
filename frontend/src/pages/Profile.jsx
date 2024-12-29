import React, { useState, useEffect } from "react";
import {
    fetchBusiness,
    fetchOperations,
    updateBusiness,
    updateOperations,
    updateUserPassword,
} from "../utils/api";

const ProfilePage = () => {
    const [business, setBusiness] = useState({ name: "", location: "" });
    const [operations, setOperations] = useState({});
    const [minEmployees, setMinEmployees] = useState({});
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const businessData = await fetchBusiness();
                const operationsData = await fetchOperations();

                setBusiness(businessData);
                setOperations(operationsData.hours || {});
                setMinEmployees(operationsData.minEmployeesPerDay || {});
                setEmail(businessData.userEmail || "");
            } catch (error) {
                console.error("Error fetching profile data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBusinessSave = async () => {
        try {
            await updateBusiness(business);
            alert("Business details updated successfully!");
        } catch (error) {
            console.error("Error updating business:", error.message);
        }
    };

    const handleOperationsSave = async () => {
        try {
            await updateOperations({ hours: operations, minEmployeesPerDay: minEmployees });
            alert("Operations updated successfully!");
        } catch (error) {
            console.error("Error updating operations:", error.message);
        }
    };

    const handleProfileSave = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("All password fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            await updateUserPassword({ password: newPassword });
            alert("Password updated successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error updating password:", error.message);
            alert("Failed to update password. Please try again.");
        }
    };

    const handleBusinessHoursChange = (day, key, value) => {
        setOperations((prev) => ({
            ...prev,
            [day]: { ...prev[day], [key]: value },
        }));
    };

    const handleMinEmployeesChange = (day, value) => {
        setMinEmployees((prev) => ({
            ...prev,
            [day]: value,
        }));
    };

    const toggleClosed = (day) => {
        setOperations((prev) => ({
            ...prev,
            [day]: { ...prev[day], closed: !prev[day].closed, start: "", end: "" },
        }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

                {/* User Info Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">User Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Old Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your current password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter a new password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Re-enter your new password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleProfileSave}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Business Details Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Business Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Business Name</label>
                            <input
                                type="text"
                                value={business.name}
                                onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Location</label>
                            <input
                                type="text"
                                value={business.location}
                                onChange={(e) => setBusiness({ ...business, location: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleBusinessSave}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Save Business Details
                    </button>
                </div>

                {/* Operations Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Operational Hours</h2>
                    <div className="space-y-4">
                        {Object.keys(operations).map((day) => (
                            <div
                                key={day}
                                className={`flex items-center justify-between p-2 border rounded-lg ${operations[day].closed ? "bg-gray-200" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-3 w-1/6">
                                    <label className="text-sm text-gray-600 font-medium w-[50px]">{day}</label>
                                    <input
                                        type="checkbox"
                                        checked={operations[day].closed}
                                        onChange={() => toggleClosed(day)}
                                        className="form-checkbox h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-xs text-gray-500">Closed?</span>
                                </div>

                                {!operations[day].closed && (
                                    <>
                                        <div className="flex gap-2 w-1/3">
                                            <input
                                                type="time"
                                                value={operations[day]?.start || ""}
                                                onChange={(e) =>
                                                    handleBusinessHoursChange(day, "start", e.target.value)
                                                }
                                                className="p-1 border rounded text-sm w-full"
                                            />
                                            <input
                                                type="time"
                                                value={operations[day]?.end || ""}
                                                onChange={(e) =>
                                                    handleBusinessHoursChange(day, "end", e.target.value)
                                                }
                                                className="p-1 border rounded text-sm w-full"
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            value={minEmployees[day] || 0}
                                            onChange={(e) =>
                                                handleMinEmployeesChange(day, Number(e.target.value))
                                            }
                                            className="p-1 border rounded text-sm w-1/6"
                                            min="0"
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleOperationsSave}
                        className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Save Operations
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;