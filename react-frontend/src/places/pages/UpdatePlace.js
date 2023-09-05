import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

// UpdatePlace 组件  页面
const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();
  let userId;

  // 自定义Hooks useForm
  // 需要更新的内容 title，description
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );
// useEffect hooks
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        // 根据ID查询place 信息
        const responseData = await sendRequest(
          `http://localhost:1000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        // userId = responseData.place.userId;
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  // 
  const placeUpdateSubmitHandler = async event => {
    // event?
    event.preventDefault();
    try {
      // 根据ID更新 place 信息，PATCH。 JSON 格式的数据
      await sendRequest(
        `http://localhost:1000/api/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      // 作用？ 更新后又重新查询User下的place?
      // 因为没有login，所有 auth.userId is null
      console.log(userId);
      history.push('/' + '64f66f6069b63128d6a3dd43' + '/places');
     // history.push('/' + auth.userId + '/places');
    } catch (err) {
      console.log(err);
    }
    
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }
  // 上面的容器组件：逻辑处理， 从后台查询数据等
  // return：需要渲染的页面信息，包含 其他展示组件
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/*   form 表单  */}
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          {/*   更新 title , description  page */}
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
