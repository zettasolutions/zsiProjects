CREATE PROCEDURE dbo.drivers_sel(
 @client_id int
,@user_id int=null
,@tab_id int = 1
,@col_no int=1
,@order_no int=0
)
AS
BEGIN
 SET NOCOUNT ON
 DECLARE @curDate DATE
 DECLARE @endDate NVARCHAR(10) 
 DECLARE @startDate NVARCHAR(10) 
 DECLARE @stmt NVARCHAR(MAX)
 IF @tab_id < 5
 BEGIN
 	SET @curDate = DATEADD(HOUR,8,GETUTCDATE())
	SET @startDate = CONVERT(VARCHAR(10),@curDate,101)
    SET @stmt = 'SELECT * FROM dbo.drivers_active_v WHERE client_id = ' + cast(@client_id AS VARCHAR(20))
 
	IF @tab_id = 2
    BEGIN
		SET @endDate = DATEADD(DAY,15,@curDate)
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),driver_license_exp_date,101) BETWEEN ''' + @startDate + ''' AND ''' + @endDate + '''';
	END

	IF @tab_id = 3
    BEGIN
		SET @endDate = CONVERT(VARCHAR(10),DATEADD(DAY,30,@curDate),101)
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),driver_license_exp_date,101) BETWEEN ''' + @startDate + ''' AND ''' + @endDate + '''';
	END
 
	IF @tab_id = 4
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),driver_license_exp_date,101) < ''' + CONVERT(VARCHAR(10),DATEADD(HOUR,8,GETUTCDATE()),101) + '''';
	
 END
 ELSE
    SET @stmt = 'SELECT * FROM dbo.drivers_inactive_v WHERE client_id = ' + cast(@client_id AS VARCHAR(20))
 
 SET @stmt= @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(10))
 IF @order_no <> 0 
    SET @stmt= @stmt + ' DESC '

 EXEC(@stmt);
END


--dbo.drivers_sel @client_id=1,@tab_id=4
