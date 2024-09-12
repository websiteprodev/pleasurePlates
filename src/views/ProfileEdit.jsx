
import React, { useState, useContext } from 'react';
import { AppContext } from '../state/app.context';
import { saveUserDetails } from '../services/users.service';

export default function ProfileEdit() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [profile, setProfile] = useState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
    });

    const updateProfile = (key, value) => {
        setProfile({
            ...profile,
            [key]: value,
        });
    };

    const handleSaveProfile = async () => {
        if (userData.isBlocked) {
            alert('Your account is blocked. You cannot edit your profile.');
            return;
        }

        try {
            await saveUserDetails({
                uid: user.uid,
                email: user.email,
                ...profile,
            });

            setAppState(prevState => ({
                ...prevState,
                userData: {
                    ...prevState.userData,
                    ...profile,
                },
            }));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="profile-edit-page">
            <h1>Edit Profile</h1>
            <div className="form-section">
                <label htmlFor="firstName">First Name: </label>
                <input
                    className="input-field"
                    value={profile.firstName}
                    onChange={e => updateProfile('firstName', e.target.value)}
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter your first name"
                /><br />
                <label htmlFor="lastName">Last Name: </label>
                <input
                    className="input-field"
                    value={profile.lastName}
                    onChange={e => updateProfile('lastName', e.target.value)}
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter your last name"
                /><br />
                <label htmlFor="phoneNumber">Phone Number: </label>
                <input
                    className="input-field"
                    value={profile.phoneNumber}
                    onChange={e => updateProfile('phoneNumber', e.target.value)}
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                /><br />
                <button className="save-profile-btn" onClick={handleSaveProfile}>Save</button>
            </div>
        </div>
    );
}
