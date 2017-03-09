
CREATE PROCEDURE [dbo].[procurement_summary_report_sel]
(
    @date_from		NVARCHAR(15) = NULL,
	@date_to		NVARCHAR(15) = NULL,
	@supplier_id	INT = NULL,
	@procurement_id	INT = NULL,
	@report_type_id INT = NULL
)
AS
BEGIN

SET NOCOUNT ON

	DECLARE @stmt NVARCHAR(1000) = '';

	SET @stmt = 'SELECT * FROM dbo.procurement_v WHERE 1=1 '

	IF (NOT @date_from IS NULL) AND (NOT @date_to IS NULL)
		SET @stmt = @stmt + 'AND procurement_date >= ''' + @date_from + ''' AND procurement_date <= ''' + @date_to + ''' '
	
	 IF ISNULL(@supplier_id,0) <> 0
		SET @stmt = @stmt + 'AND supplier_id = ' + CAST(@supplier_id AS VARCHAR(50)) + ' '
	
    IF ISNULL(@procurement_id,0) <> 0
		SET @stmt = @stmt + 'AND procurement_id  = ' + cast(@procurement_id as varchar(1))
	
	 IF ISNULL(@report_type_id,0) <> 0
	   SET @stmt = @stmt + 'AND delivery_timing = ' + cast(@report_type_id as varchar(1))

	print(@stmt)    
	EXEC(@stmt);
END
