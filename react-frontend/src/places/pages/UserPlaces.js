import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

// 在React中调用后端接口，常用的方式有两种：使用fetch API和使用axios。
// fetch是es6新增的用于网络请求标准api，它是一个api。
// axios是用于网络请求的第三方库，它是一个库。

// UserPlaces 容器组件 page
const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  console.log(userId);
 //  useEffect Hooks
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // http://localhost:1000/api/places/user/64f3e8ac3cd83adee24f6c85
        const responseData = await sendRequest(
          `http://localhost:1000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);
  // userId 改变的话才会重新加载

  // 删除操作
  const placeDeletedHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };

// 调用PlaceList 展示组件，items 传给 PlaceList的prons
return (
  <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && (
      <div className="center">
        <LoadingSpinner />
      </div>
    )}
    
    {!isLoading && loadedPlaces && (
      <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
    )}
  </React.Fragment>
);

};

export default UserPlaces;
