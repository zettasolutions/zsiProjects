CREATE procedure [dbo].[payment_history_sel]
( 
  @client_id  int
 ,@vehicle_id int = null
 ,@driver_id  int = null
 ,@pdate_from varchar(10)=null
 ,@pdate_to   varchar(10)=null
 ,@user_id    int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt VARCHAR(MAX)

  SET @stmt = 'SELECT * FROM dbo.payments_v WHERE client_id = ' + CAST(@client_id AS VARCHAR(20))

  IF ISNULL(@vehicle_id,0)<>0
     SET @stmt = @stmt + ' AND vehicle_id = ' + CAST(@vehicle_id AS VARCHAR(20))
  
  IF ISNULL(@driver_id,0)<>0
     SET @stmt = @stmt + ' AND driver_id = ' + CAST(@driver_id AS VARCHAR(20))
  
  SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10), payment_date,101) between ''' + @pdate_from + ''' AND ''' +  @pdate_to + ''''
  
  SET @stmt = @stmt + ' ORDER BY payment_id';
  EXEC(@stmt);
END


--[dbo].[payment_history_sel] @client_id=1, @pdate_from='06/29/2020',@pdate_to='06/29/2020'



