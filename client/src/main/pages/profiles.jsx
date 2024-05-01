import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import './profiles.css';
import CountryList from 'react-select-country-list';

const Profiles = () => {
  const { userId } = useParams();
  const user = { uid: userId }; // assuming userId is the user ID
  
  const countryOptions = CountryList().getData();
  const getCountryName = (countryCode) => {
    const country = countryOptions.find((c) => c.value === countryCode);
    return country ? country.label : '';
  };

  const { data: profileData, error: profileError, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profileData', user.uid],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/getOthersProfileData/${user.uid}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data from Firestore');
      }

      return response.json();
    }
  });

  if (isProfileLoading) {
    return <div>Loading...</div>;
  }

  if (profileError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
          <div className="profile-container">
      <div className="profile-card">
        <img
          src={profileData.profile.photoURL}
          alt="Profile Picture"
          className="profile-picture"
        />
        <h2 className="profile-name">{profileData.profile.displayName}</h2>
        <div className="profile-info">
          <label>Bio:</label>
          <p className="profile-bio">{profileData.db.bio}</p>
          <label>Country:</label>
          <p className="profile-country">
            {getCountryName(profileData.db.country)}
          </p>
          <label>Proficiency Level:</label>
          <p className="profile-level">{profileData.db.level.toUpperCase()}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profiles;