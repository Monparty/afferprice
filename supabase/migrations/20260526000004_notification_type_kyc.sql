-- Allow 'kyc' notification type สำหรับแจ้งผล KYC ให้ user
ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('bid','win','lose','payment','shipping','kyc'));
