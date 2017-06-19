

CREATE PROCEDURE [dbo].[receiving_summary_report_sel] 
(
    @dealer_id          int=null
   ,@supply_source_id   int=null
   ,@receiving_type     varchar(50)=null
   ,@date_from	        NVARCHAR(15) = NULL
   ,@date_to	        NVARCHAR(15) = NULL
   ,@warehouse_id       INT = NULL
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt VARCHAR(MAX)
  

  SET @stmt =  'SELECT * FROM dbo.receiving_reports_v WHERE status_id=16'
  
	IF (NOT @date_from IS NULL) AND (NOT @date_to IS NULL)
		SET @stmt = @stmt + 'AND received_date >= ''' + @date_from + ''' AND received_date <= ''' + @date_to + ''' '

  IF @dealer_id IS NOT NULL  
      SET @stmt = @stmt + ' AND dealer_id= ' + cast(@dealer_id as varchar(20)) 

  IF @warehouse_id IS NOT NULL  
      SET @stmt = @stmt + ' AND warehouse_id= ' + cast(@warehouse_id as varchar(20))

  IF @supply_source_id IS NOT NULL  
      SET @stmt = @stmt + ' AND supply_source_id= ' + cast(@supply_source_id as varchar(20))

   IF ISNULL(@receiving_type,'') <> ''
      SET @stmt = @stmt + ' AND receiving_type= ''' + @receiving_type + ''''

   SET @stmt = @stmt + ' ORDER BY received_date '


  exec(@stmt);
	
END








