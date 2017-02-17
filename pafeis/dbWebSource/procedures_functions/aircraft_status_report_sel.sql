
CREATE PROCEDURE [dbo].[aircraft_status_report_sel]
(
    @user_id int = NULL
   ,@col_no INT = 1
   ,@order_no INT = 0
   ,@pno INT = 1
   ,@rpp INT = 20
)
AS
BEGIN
  DECLARE @stmt           VARCHAR(4000);
  DECLARE @order          VARCHAR(4000);
  DECLARE @count INT = 0;
  DECLARE @page_count INT = 1;
  
  SET @stmt = 'SELECT dbo.getAircraftType(aircraft_type_id) as aircraft_type, COUNT(status_id) countStatus, status_name, aircraft_type_id FROM dbo.aircraft_info_v GROUP BY aircraft_type_id, status_name'; 
  SET @order = ' ORDER BY ' + CAST(@col_no + 1 AS VARCHAR(1)) + ' ' + IIF(@order_no=0,'ASC','DESC');   
  SELECT @count = COUNT(*) FROM dbo.user_role_v; 

	SET @stmt = @stmt + @order
	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
	print @page_count;
	RETURN @page_count;
END;

