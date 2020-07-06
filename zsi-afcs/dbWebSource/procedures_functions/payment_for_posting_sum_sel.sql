CREATE procedure [dbo].[payment_for_posting_sum_sel]
( 
 @user_id int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  DECLARE @client_id int 
  SELECT @client_id=company_id from dbo.users where user_id=@user_id;
  SELECT payment_date, vehicle_id, vehicle_plate_no,sum(total_paid_amount) total_fare FROM 
  (SELECT convert(varchar(10),payment_date,101) payment_date , vehicle_plate_no,  total_paid_amount, client_id, vehicle_id FROM dbo.payments_transactions_for_posting_v where client_id=@client_id) AS x
  group by payment_date , vehicle_plate_no, vehicle_id order by payment_date
END


