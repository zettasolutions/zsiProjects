CREATE procedure [dbo].[payment_for_posting_sel]
( 
  @vehicle_id int = null
 ,@user_id int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  SELECT * FROM dbo.payments_transactions_for_posting_v WHERE vehicle_id = @vehicle_id;
END



