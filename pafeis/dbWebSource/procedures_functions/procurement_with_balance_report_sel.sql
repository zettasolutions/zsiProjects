
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: March 1, 2017 11:48 PM
-- Description:	Procurement with quantity remaining balance report.
-- =============================================
CREATE PROCEDURE [dbo].[procurement_with_balance_report_sel]
(
    @date_from		NVARCHAR(15),
	@date_to		NVARCHAR(15),
	@supplier_id	INT,
	@search			NVARCHAR(20)
)
AS
BEGIN

SET NOCOUNT ON

	DECLARE @stmt NVARCHAR(1000) = '';

	SET @stmt = 'SELECT b.item_no, b.part_no, b.national_stock_no, b.item_description, b.unit_of_measure_code, b.quantity, b.total_delivered_quantity, b.balance_quantity ' +
				'FROM dbo.procurement AS a ' +
				'INNER JOIN dbo.procurement_detail_v AS b ON a.procurement_id = b.procurement_id ' +
				'WHERE 1=1 ' +
				'AND b.balance_quantity > 0 '

	IF @date_from IS NOT NULL AND @date_to IS NOT NULL
		SET @stmt = @stmt + 'AND a.procurement_date >= ''' + @date_from + ''' AND a.procurement_date <= ''' + @date_to + ''' '

	IF @supplier_id IS NOT NULL
		SET @stmt = @stmt + 'AND a.supplier_id = ' + CAST(@supplier_id AS VARCHAR(50)) + ' '
	
	IF @search IS NOT NULL			
		SET @stmt = @stmt + 'AND a.procurement_code LIKE ''%' + @search + '%'''
	
	EXEC(@stmt);
END

