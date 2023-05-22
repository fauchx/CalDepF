import React from 'react';
import { ThreeDots } from  'react-loader-spinner';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
        <ThreeDots 
            height="80" 
            width="80" 
            radius="9"
            color="#58b8ee" 
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
        />
    </div>
  );
};

export default Loader;