
CREATE PROCEDURE [dbo].[procurement_detail_report_sel]
(
    @date_from			NVARCHAR(15) = NULL,
	@date_to			NVARCHAR(15) = NULL,
	@supplier_id		INT = NULL,
	@search				NVARCHAR(20) = NULL,
	@procurement_id		INT = NULL
)
AS
BEGIN

SET NOCOUNT ON

	DECLARE @stmt NVARCHAR(1000) = '';

	SET @stmt = 'SELECT b.item_no, b.part_no, b.national_stock_no, b.item_description, b.unit_of_measure_code, b.quantity, b.unit_price, b.amount ' +
				'FROM dbo.procurement AS a ' +
				'INNER JOIN dbo.procurement_detail_v AS b ON a.procurement_id = b.procurement_id ' +
				'WHERE 1=1 '

	IF @date_from IS NOT NULL AND @date_to IS NOT NULL
		SET @stmt = @stmt + 'AND a.procurement_date >= ''' + @date_from + ''' AND a.procurement_date <= ''' + @date_to + ''' '

	IF @supplier_id IS NOT NULL
		SET @stmt = @stmt + 'AND a.supplier_id = ' + CAST(@supplier_id AS VARCHAR(50)) + ' '
	
	IF @search IS NOT NULL			
		SET @stmt = @stmt + 'AND a.procurement_code LIKE ''%' + @search + '%'' '

	IF @procurement_id IS NOT NULL
		SET @stmt = @stmt + 'AND a.procurement_id = ' + CAST(@procurement_id AS VARCHAR(50)) + ' '
	
	EXEC(@stmt);
END

