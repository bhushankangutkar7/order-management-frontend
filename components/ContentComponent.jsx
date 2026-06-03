export default function ContentComponent({children}) {

  return (
    <div style={{ padding: '0 48px', marginTop: '30px'}}>
      <div
        style={{
          padding: 24,
          minHeight: '75vh'
        }}
      >
        {children}
      </div>
    </div>
  );
}