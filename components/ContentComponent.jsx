export default function ContentComponent({children}) {

  return (
      <div
        className='mt-[7.5vh] m-6 p-6 min-h-[85vh] flex justify-center align-center'
      >
        {children}
      </div>
  );
}