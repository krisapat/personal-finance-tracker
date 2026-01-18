// --- ส่วนของ Component ย่อยสำหรับจัดการ Blob ---
export const BackgroundDecor = () => {
  const primaryColor = "#00c950"; // สีเขียวหลักที่คุณต้องการ

  const blobStyle = {
    clipPath: 'polygon(74.1% 44.1%, 72.5% 32.5%, 45.2% 34.5%, 22% 67%, 0 100%, 30% 100%, 38% 81%, 60% 89%)',
    background: `linear-gradient(to top right, ${primaryColor}, #a0f4d0)`,
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Blob ตัวบน */}
      <div className="absolute inset-x-0 -top-40 transform-gpu blur-3xl sm:-top-80">
        <div
          style={blobStyle}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2  opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Blob ตัวล่าง */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          style={blobStyle}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
};