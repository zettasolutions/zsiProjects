CREATE procedure [dbo].[payment_for_posting_sel]
( 
  @client_id  int 
 ,@vehicle_id int = null
 ,@user_id int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  SET @stmt = 'SELECT * FROM dbo.payments_transactions_for_posting_v WHERE client_id = ' + CAST(@client_id AS VARCHAR(20))
  
  IF ISNULL(@vehicle_id,0) <> 0
     SET @stmt = @stmt + ' AND vehicle_id = ' + CAST(@vehicle_id AS VARCHAR(20));

  EXEC(@stmt);

END



