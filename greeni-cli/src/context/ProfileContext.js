// 앱 전역에서 프로필 리스트를 관리하기 위해 ProfileContext.js 생성
import React, { createContext, useEffect, useState } from "react";
import { getSelectedProfile } from "../utils/tokenStorage";

// 빈 Context 생성 
export const ProfileContext = createContext();

// Context에 데이터를 공급하는 역할
// ProfileProvide로 감싸진 모든 화면에서 profiles와 setProfiles 공유 가능
export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const restoreSelectedProfile = async () => {
      try {
        const savedProfile = await getSelectedProfile();
        if (savedProfile) {
          setSelectedProfile(savedProfile);
        }
      } catch (e) {
        console.log("RESTORE SELECTED PROFILE FAIL:", e);
      }
    };

    restoreSelectedProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profiles, setProfiles, selectedProfile, setSelectedProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};