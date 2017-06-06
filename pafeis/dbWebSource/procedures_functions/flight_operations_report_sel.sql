CREATE PROCEDURE dbo.flight_operations_report_sel (
   @organization_id INT
  ,@date_from NVARCHAR(15) = NULL
  ,@date_to   NVARCHAR(15) = NULL 
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)

   SET @stmt = 'SELECT * FROM dbo.flight_operation_flight_time_v WHERE 1=1'
   
   IF ISNULL(@organization_id,0) <> 0
      SET @stmt = @stmt + ' AND squadron_id=' + cast(@organization_id as varchar(20)) + ' OR organization_id=' + cast(@organization_id as varchar(20))

   IF @date_from IS NOT NULL
      SET @stmt = @stmt + ' AND flight_schedule_date >= ''' + @date_from + ''''

   IF @date_to IS NOT NULL
      SET @stmt = @stmt + ' AND flight_schedule_date <= ''' + @date_to + ''''

    SET @stmt = @stmt + ' ORDER BY flight_schedule_date '; 

EXEC(@stmt);
END

