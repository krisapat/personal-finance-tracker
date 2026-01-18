
npx prisma validate
npx prisma db push

# 1. ปิด dev server ก่อน
# 2. ล้าง client เก่า
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

# 3. generate ใหม่จาก schema ปัจจุบัน
npx prisma generate

# 4. sync db (เลือกอย่างใดอย่างหนึ่ง)
npx prisma db push
# หรือ
npx prisma migrate dev

# 5. เปิด dev server ใหม่
npm run dev
