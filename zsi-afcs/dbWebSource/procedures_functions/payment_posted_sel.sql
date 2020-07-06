CREATE procedure [dbo].[payment_posted_sel]
( 
  @post_id		int 
 ,@vehicle_id	int
 ,@user_id		int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  SELECT * FROM dbo.payments_transactions_posted_v WHERE post_id = @post_id and vehicle_id = @vehicle_id;
END



