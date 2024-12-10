// components/Loader.js
const Loader = () => {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000]">
       <span className="loading loading-bars loading-lg size-16 text-orange-600 "></span>
      </div>
    );
  };
  
  export default Loader;
  
