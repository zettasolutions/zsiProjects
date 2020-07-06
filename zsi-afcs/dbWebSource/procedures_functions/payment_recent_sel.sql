CREATE procedure [dbo].[payment_recent_sel]
( 
  @vehicle_id int = null
 ,@driver_id  int = null
 ,@user_id    int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt VARCHAR(MAX)
  DECLARE @client_id INT

  SELECT @client_id = company_id FROM dbo.users_v WHERE [user_id] = @user_id;
  SET @stmt = 'SELECT * FROM dbo.payments_v WHERE CONVERT(VARCHAR(10),payment_date,101)=CONVERT(VARCHAR(10),DATEADD(HOUR, 8, GETUTCDATE()),101) '

  IF ISNULL(@client_id,0)<>0
     SET @stmt = @stmt + ' AND client_id = ' + CAST(@client_id AS VARCHAR(20))

  IF ISNULL(@vehicle_id,0)<>0
     SET @stmt = @stmt + ' AND vehicle_id = ' + CAST(@vehicle_id AS VARCHAR(20))
  
  IF ISNULL(@driver_id,0)<>0
     SET @stmt = @stmt + ' AND driver_id = ' + CAST(@driver_id AS VARCHAR(20))
  
  SET @stmt = @stmt + ' ORDER BY payment_id';
  EXEC(@stmt);
END


--[dbo].[payment_recent_sel] @client_id=1