
CREATE PROCEDURE [dbo].[procurement_summary_report_sel]
(
    @date_from		NVARCHAR(15) = NULL,
	@date_to		NVARCHAR(15) = NULL,
	@supplier_id	INT = NULL,
	@procurement_id	INT = NULL,
	@procurment_mode VARCHAR(20)=NULL,
	@report_type_id INT = NULL,
	@organization_id INT = NULL
)
AS
BEGIN

SET NOCOUNT ON

	DECLARE @stmt NVARCHAR(1000) = '';

	SET @stmt = 'SELECT distinct *, iif(total_balance_qty = total_ordered_qty, ''FOR DELIVERY'', iif(total_balance_qty = 0 ,''DELIVERED'', ''PARTIAL DELIVERED'')) delivery_status, dbo.delivery_timing_status(delivery_timing) timing_status  FROM dbo.procurement_v WHERE status_name <> ''NEW'' '

	IF (NOT @date_from IS NULL) AND (NOT @date_to IS NULL)
		SET @stmt = @stmt + 'AND procurement_date >= ''' + @date_from + ''' AND procurement_date <= ''' + @date_to + ''' '

	 IF ISNULL(@organization_id,0) <> 0
		SET @stmt = @stmt + 'AND organization_id = ' + CAST(@organization_id AS VARCHAR(50)) + ' '
	
	 IF ISNULL(@supplier_id,0) <> 0
		SET @stmt = @stmt + 'AND supplier_id = ' + CAST(@supplier_id AS VARCHAR(50)) + ' '
	
    IF ISNULL(@procurement_id,0) <> 0
		SET @stmt = @stmt + 'AND procurement_id  = ' + cast(@procurement_id as varchar(20))

    IF ISNULL(@procurment_mode,'') <> ''
		SET @stmt = @stmt + 'AND procurment_mode  = ''' + @procurment_mode + ''''
	
	 IF ISNULL(@report_type_id,0) >1
	   SET @stmt = @stmt + 'AND delivery_timing = ' + cast(@report_type_id as varchar(20))

	--print(@stmt)    
	EXEC(@stmt);
END
