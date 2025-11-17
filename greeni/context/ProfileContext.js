// 앱 전역에서 프로필 리스트를 관리하기 위해 ProfileContext.js 생성
import React, { createContext, useState } from "react";

// 빈 Context 생성 
export const ProfileContext = createContext();

// Context에 데이터를 공급하는 역할
// ProfileProvide로 감싸진 모든 화면에서 profiles와 setProfiles 공유 가능
export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);

  return (
    <ProfileContext.Provider value={{ profiles, setProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
};