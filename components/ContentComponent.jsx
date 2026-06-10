export default function ContentComponent({children}) {

  return (
      <div
        className='mt-[7.5vh] m-6 p-6 min-h-[85vh] min-w-[300px] flex justify-center align-center'
      >
        {children}
      </div>
  );
}